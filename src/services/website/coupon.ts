'use server'

/* eslint-disable @typescript-eslint/no-explicit-any */

import prisma from "@/src/lib/prisma";

interface CartItemInput {
    courseId: string;
    price: number;
    title?: string;
}

// Validates a coupon against the current cart and returns its normalized meta so the
// client can compute (and re-compute) the discount as the cart changes. Discount math
// is intentionally returned as metadata (isFixedAmount + discountAmount + scope) rather
// than a single frozen number, so removing an item keeps the discount correct.
export const validateCoupon = async (code: string, cartItems: CartItemInput[]) => {
    try {
        const trimmed = code.trim();
        if (!trimmed) {
            return { success: false, message: 'Please enter a coupon code.', coupon: null };
        }

        if (!cartItems || cartItems.length === 0) {
            return { success: false, message: 'Your cart is empty.', coupon: null };
        }

        const coupon = await prisma.coupon.findFirst({
            where: {
                code: { equals: trimmed, mode: 'insensitive' },
                isActive: true,
                deletedAt: null,
            },
            include: {
                course: { select: { id: true, title: true } },
            },
        });

        if (!coupon) {
            return { success: false, message: 'Invalid coupon code.', coupon: null };
        }

        const now = new Date();
        if (now < coupon.startDate) {
            return { success: false, message: 'This coupon is not active yet.', coupon: null };
        }
        if (now > coupon.endDate) {
            return { success: false, message: 'This coupon has expired.', coupon: null };
        }
        if (coupon.totalUsed >= coupon.maxUse) {
            return { success: false, message: 'This coupon has reached its usage limit.', coupon: null };
        }

        // Course-scoped coupon: the specific course must be in the cart.
        if (coupon.courseId) {
            const inCart = cartItems.some((i) => i.courseId === coupon.courseId);
            if (!inCart) {
                return {
                    success: false,
                    message: `This coupon only applies to ${coupon.course?.title ?? 'a specific course'}, which isn't in your cart.`,
                    coupon: null,
                };
            }
        }

        return {
            success: true,
            message: 'Coupon applied.',
            coupon: {
                id: coupon.id,
                code: coupon.code,
                name: coupon.name,
                type: coupon.courseId ? ('course' as const) : ('cart' as const),
                isFixedAmount: coupon.isFixedAmount,
                discountAmount: coupon.discountAmount,
                courseId: coupon.courseId,
                courseName: coupon.course?.title ?? null,
            },
        };
    } catch (error) {
        console.log("Error validating coupon:", error);
        return { success: false, message: 'Could not validate coupon. Please try again.', coupon: null };
    }
}

// Records a use of each applied coupon after a successful payment.
export const recordCouponUsage = async (couponIds: string[]) => {
    try {
        if (!couponIds || couponIds.length === 0) return { success: true };
        await prisma.coupon.updateMany({
            where: { id: { in: couponIds } },
            data: { totalUsed: { increment: 1 } },
        });
        return { success: true };
    } catch (error) {
        console.log("Error recording coupon usage:", error);
        return { success: false };
    }
}
