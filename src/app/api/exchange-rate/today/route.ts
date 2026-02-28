import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

const getTodayKey = (): string => {
    const now = new Date();
    return now.toISOString().slice(0, 10); // YYYY-MM-DD
};

export async function GET() {
    try {
        const todayKey = getTodayKey();

        const startOfDay = new Date(`${todayKey}T00:00:00.000Z`);
        const endOfDay = new Date(`${todayKey}T23:59:59.999Z`);

        const record = await prisma.exchangeRate.findFirst({
            where: {
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        if (!record) {
            return NextResponse.json(
                { success: false, message: "No exchange rate for today" },
                { status: 404 }
            );
        }

        let conversionRates: Record<string, number> = {};
        try {
            conversionRates = JSON.parse(record.conversionRates);
        } catch (error) {
            console.error("Failed to parse stored exchange rates", error);
            return NextResponse.json(
                { success: false, message: "Stored exchange rates are invalid" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            date: todayKey,
            base: "NGN",
            conversion_rates: conversionRates,
        });
    } catch (error) {
        console.error("Failed to fetch today's exchange rate", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch today's exchange rate" },
            { status: 500 }
        );
    }
}

