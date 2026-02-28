import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { date, base, conversion_rates } = body as {
            date?: string;
            base?: string;
            conversion_rates?: Record<string, number>;
        };

        if (!conversion_rates || typeof conversion_rates !== 'object') {
            return NextResponse.json(
                { success: false, message: "conversion_rates is required" },
                { status: 400 }
            );
        }

        // Store only the conversion rates JSON; date/base are inferred (NGN, createdAt)
        const record = await prisma.exchangeRate.create({
            data: {
                conversionRates: JSON.stringify(conversion_rates),
            },
        });

        const recordDate =
            date ??
            record.createdAt.toISOString().slice(0, 10); // YYYY-MM-DD

        return NextResponse.json({
            success: true,
            record: {
                id: record.id,
                date: recordDate,
                base: base ?? "NGN",
                conversion_rates,
            },
        });
    } catch (error) {
        console.error("Failed to save exchange rates", error);
        return NextResponse.json(
            { success: false, message: "Failed to save exchange rates" },
            { status: 500 }
        );
    }
}

