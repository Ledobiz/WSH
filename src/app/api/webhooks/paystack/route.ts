import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/src/lib/prisma";
import { verifyPaystackTransaction } from "@/src/services/website/cart";

// Paystack posts a JSON event and signs the *raw* body with an HMAC SHA512 of the
// secret key, delivered in the `x-paystack-signature` header. We must read the raw
// body (not the parsed JSON) to recompute the signature.
export async function POST(request: NextRequest) {
    try {
        const secretKey = process.env.PAYSTACK_SECRET_KEY;
        if (!secretKey) {
            console.error("Paystack webhook: PAYSTACK_SECRET_KEY is not configured");
            return NextResponse.json({ success: false }, { status: 500 });
        }

        const rawBody = await request.text();
        const signature = request.headers.get("x-paystack-signature") || "";

        const expected = crypto
            .createHmac("sha512", secretKey)
            .update(rawBody)
            .digest("hex");

        // Constant-time comparison to avoid leaking timing information.
        const valid =
            signature.length === expected.length &&
            crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));

        if (!valid) {
            console.warn("Paystack webhook: invalid signature");
            return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 401 });
        }

        const payload = JSON.parse(rawBody);

        // We only act on successful charges. Everything else is acknowledged and ignored.
        if (payload?.event !== "charge.success" || payload?.data?.status !== "success") {
            return NextResponse.json({ success: true, message: "Event ignored" });
        }

        const reference: string | undefined = payload.data.reference;
        const email: string | undefined =
            payload.data.customer?.email || payload.data.metadata?.consumer_email;

        if (!reference || !email) {
            console.warn("Paystack webhook: missing reference or email", { reference, email });
            // Acknowledge so Paystack doesn't keep retrying an unactionable event.
            return NextResponse.json({ success: true, message: "Nothing to process" });
        }

        const user = await prisma.user.findFirst({
            where: { email, deletedAt: null },
        });

        if (!user) {
            console.warn("Paystack webhook: no user found for email", email);
            return NextResponse.json({ success: true, message: "User not found" });
        }

        // Re-verify with Paystack's API (never trust the payload alone) and record.
        // verifyPaystackTransaction is idempotent — safe if the client already verified.
        const result = await verifyPaystackTransaction(reference, user.id);

        return NextResponse.json({ success: result.success, message: result.message });
    } catch (error) {
        console.error("Paystack webhook error:", error);
        return NextResponse.json({ success: false, message: "Webhook processing failed" }, { status: 500 });
    }
}
