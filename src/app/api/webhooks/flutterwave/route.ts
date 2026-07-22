import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { verifyFlutterwaveTransaction } from "@/src/services/website/cart";

// Flutterwave authenticates webhooks with a shared secret hash. You set the value in
// the Flutterwave dashboard (Settings -> Webhooks -> "Secret hash") and it is sent back
// on every request in the `verif-hash` header. We compare it against FLUTTERWAVE_SECRET_HASH.
export async function POST(request: NextRequest) {
    try {
        const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;
        if (!secretHash) {
            console.error("Flutterwave webhook: FLUTTERWAVE_SECRET_HASH is not configured");
            return NextResponse.json({ success: false }, { status: 500 });
        }

        const signature = request.headers.get("verif-hash") || "";
        if (!signature || signature !== secretHash) {
            console.warn("Flutterwave webhook: invalid signature");
            return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 401 });
        }

        const payload = await request.json();

        // Only act on completed, successful charges.
        const eventType = payload?.event || payload?.["event.type"];
        const data = payload?.data || payload;

        if (eventType !== "charge.completed" || data?.status !== "successful") {
            return NextResponse.json({ success: true, message: "Event ignored" });
        }

        const transactionId = data.id; // Flutterwave transaction id used for verification
        const email: string | undefined = data.customer?.email;

        if (!transactionId || !email) {
            console.warn("Flutterwave webhook: missing transaction id or email", { transactionId, email });
            return NextResponse.json({ success: true, message: "Nothing to process" });
        }

        const user = await prisma.user.findFirst({
            where: { email, deletedAt: null },
        });

        if (!user) {
            console.warn("Flutterwave webhook: no user found for email", email);
            return NextResponse.json({ success: true, message: "User not found" });
        }

        // Re-verify with Flutterwave's API and record. verifyFlutterwaveTransaction is
        // idempotent — safe if the client already verified this same payment.
        const result = await verifyFlutterwaveTransaction(String(transactionId), user.id);

        return NextResponse.json({ success: result.success, message: result.message });
    } catch (error) {
        console.error("Flutterwave webhook error:", error);
        return NextResponse.json({ success: false, message: "Webhook processing failed" }, { status: 500 });
    }
}
