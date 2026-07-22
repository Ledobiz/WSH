'use server'

import error from "@/src/app/error";
import { inngest } from "@/src/inngest/client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import prisma from "@/src/lib/prisma";
import { assignCourseToStudent } from "../admin/student";

export const myCart = async (userId: string) => {
    try {
        const cart = await prisma.cart.findFirst({
            where: {
                userId,
                isPaid: false,
            },
            include: {
                cartItems: {
                    include: {
                        course: true,
                    }
                }
            }
        });

        /*const totalFees = cart?.cartItems.reduce((total, item) => {
            return total + (item.course?.discountedFee || item.course?.originalFee || 0);
        }, 0) || 0;*/

        const cartItems = cart?.cartItems.map((item) => ({
            id: item.course?.id,
            title: item.course?.title,
            thumbnail: item.course?.thumbnail,
            discountedFee: item.course?.discountedFee,
            originalFee: item.course?.originalFee,
        })) || [];

        return {
            success: true,
            message: "Cart fetched successfully.",
            cart: cartItems || [],
        }
    } catch (error) {
        console.error("Error fetching cart:", error);
        return {
            success: false,
            message: "Failed to fetch cart.",
            cart: [],
        }
    }
}

export const mergeCartWithServer = async (userId: string, localItems: any[]) => {
    try {
        // 1. Find the user's active cart or create one
        let cart = await prisma.cart.findFirst({
            where: { userId, isPaid: false }
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: {
                    userId,
                    isPaid: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            });
        }

        // 2. Add local items to the database
        // We use Promise.all to handle multiple additions efficiently
        await Promise.all(
            localItems.map((item) =>
                prisma.cartItem.upsert({
                    where: {
                        cartId_courseId: {
                            cartId: cart.id,
                            courseId: item.id
                        }
                    },
                    update: {
                        price: item.discountedFee,
                    },
                    create: {
                        cartId: cart!.id,
                        courseId: item.id,
                        price: item.discountedFee,
                        currency: 'NGN',
                    }
                })
            )
        );

        return { success: true };
    } catch (error) {
        console.error("Merge error:", error);
        return { success: false };
    }
};

export const removeFromCartServer = async (userId: string, courseId: string) => {
    try {
        const cart = await prisma.cart.findFirst({
            where: { userId, isPaid: false },
        });

        if (!cart) return { success: false, message: "Cart not found" };

        await prisma.cartItem.delete({
            where: {
                cartId_courseId: {
                    cartId: cart.id,
                    courseId: courseId
                }
            },
        });

        return { success: true, message: "Item removed from database" };
    } catch (error) {
        console.error("Delete from cart error:", error);
        return { success: false, message: "Failed to remove item" };
    }
};

export const addToCartServer = async (userId: string, courseId: string) => {
    try {
        // Find or Create the active cart
        let cart = await prisma.cart.findFirst({
            where: { userId, isPaid: false },
        });

        const course = await prisma.course.findUnique({
            where: { id: courseId },
        });

        let courseFee = 0;
        if (course) {
            courseFee = course.isFree ? 0 : (course.discountedFee || 0);
        }

        if (!cart) {
            cart = await prisma.cart.create({
                data: {
                    userId,
                    isPaid: false,
                }
            });
        }

        // Using upsert prevents errors if the user clicks twice
        await prisma.cartItem.upsert({
            where: {
                cartId_courseId: {
                    cartId: cart.id,
                    courseId: courseId
                }
            },
            update: {
                price: courseFee,
            },
            create: {
                cartId: cart.id,
                courseId: courseId,
                price: courseFee,
                currency: 'NGN',
            }
        });

        return { success: true };
    } catch (error) {
        console.error("Add to cart server error:", error);
        return { success: false, message: "Database sync failed" };
    }
};

export const verifyFlutterwaveTransaction = async (paymentId: string, userId: string) => {
    try {
        const secretKey = process.env.FLUTTERWAVE_SECRET_KEY!;
        const response = await fetch('https://api.flutterwave.com/v3/transactions/' + paymentId + '/verify', {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${secretKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            return { success: false, message: "Transaction verification failed" };
        }

        const data = await response.json();

        if (data.status === 'success' && data.data.status === 'successful') {
            return await recordSuccessfulPayment({
                userId,
                reference: data.data.tx_ref,
                gateway: 'Flutterwave',
                amount: Math.round(Number(data.data.amount)),
                currency: String(data.data.currency || '').trim().toUpperCase(),
                first4Digits: data.data.card?.first_6digits,
                last4Digits: data.data.card?.last_4digits,
                cardBrand: data.data.card?.type,
                ipAddress: data.data.ip,
            });
        }

        return { success: false, message: "Payment verification failed. Please contact WSH support if you have been charged" };
    } catch (error) {
        console.error("Transaction verification error:", error);
        return { success: false, message: "Transaction verification failed" };
    }
}

export const verifyPaystackTransaction = async (reference: string, userId: string) => {
    if (!reference || !userId) {
        return { success: false, message: "Transaction verification failed" };
    }

    try {
        const secretKey = process.env.PAYSTACK_SECRET_KEY!;
        const response = await fetch('https://api.paystack.co/transaction/verify/' + reference, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${secretKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            return { success: false, message: "Transaction verification failed" };
        }

        const data = await response.json();

        if (data.status === true && data.data.status === 'success') {
            return await recordSuccessfulPayment({
                userId,
                reference: data.data.reference,
                gateway: 'Paystack',
                amount: Math.round(Number(data.data.amount) / 100), // kobo -> base units
                currency: String(data.data.currency || '').trim().toUpperCase(),
                first4Digits: data.data.authorization?.bin,
                last4Digits: data.data.authorization?.last4,
                cardBrand: data.data.authorization?.brand,
                ipAddress: data.data.ip_address,
            });
        }

        return { success: false, message: "Payment verification failed. Please contact WSH support if you have been charged" };
    } catch (error) {
        console.error("Transaction verification error:", error);
        return { success: false, message: "Transaction verification failed" };
    }
}

interface RecordPaymentDetails {
    userId: string;
    reference: string;
    gateway: 'Paystack' | 'Flutterwave';
    amount: number;
    currency: string;
    first4Digits?: string | null;
    last4Digits?: string | null;
    cardBrand?: string | null;
    ipAddress?: string | null;
}

/**
 * Records a successful payment and enrols the student — idempotently.
 *
 * The gateway `reference` is unique per checkout and is the same value whether we
 * arrive here from the client-side verification (after the payment popup) or from a
 * gateway webhook. We use it as the idempotency key so a payment that is verified twice
 * (e.g. client callback AND webhook, or a webhook retry) is only ever recorded and
 * enrolled once. This is what prevents double course enrolment.
 */
const recordSuccessfulPayment = async (details: RecordPaymentDetails) => {
    // If this reference has already been recorded as successful, do nothing further.
    const existing = await prisma.transaction.findUnique({
        where: { reference: details.reference },
    });

    if (existing && existing.status === 'success') {
        return { success: true, alreadyProcessed: true, message: "Payment already recorded." };
    }

    const user = await prisma.user.findUnique({ where: { id: details.userId } });

    const paymentData = {
        gateway: details.gateway,
        currency: details.currency,
        amount: details.amount,
        first4Digits: details.first4Digits || '',
        last4Digits: details.last4Digits || '',
        cardBrand: details.cardBrand || '',
        status: 'success' as const,
        ipAddress: details.ipAddress || '',
    };

    try {
        if (existing) {
            // A prior pending/failed record for this reference — promote it to success.
            await prisma.transaction.update({
                where: { reference: details.reference },
                data: paymentData,
            });
        } else {
            await prisma.transaction.create({
                data: {
                    userId: details.userId,
                    reference: details.reference,
                    name: user ? user.name : 'Unknown',
                    email: user ? user.email : '',
                    phone: user ? user.phone : '',
                    ...paymentData,
                },
            });
        }
    } catch (error: any) {
        // Unique-constraint violation on `reference` means another concurrent call
        // (e.g. the webhook firing at the same moment) already recorded this payment.
        if (error?.code === 'P2002') {
            return { success: true, alreadyProcessed: true, message: "Payment already recorded." };
        }
        throw error;
    }

    await queueCourseForAutoAssigning(details.userId, details.reference);

    return { success: true, alreadyProcessed: false, message: "Transaction verified successfully" };
};

export const assignFreeCourse = async (courseId: string, userId: string) => {
    if (!courseId || !userId) {
        return { success: false, message: "Invalid request, please try again" };
    }

    // Confirm that the course is free
    const course = await prisma.course.findUnique({
        where: { id: courseId }
    });

    if (!course) {
        return { success: false, message: 'Sorry, we cannot find the course' }
    }

    if (!course.isFree) {
        return { success: false, message: 'Bad request! This course is not free' }
    }

    return await assignCourseToStudent(userId, courseId, false);
}

export const fetchNewlyPaidCourses = async (userId: string, reference: string) => {
    const cart = await prisma.cart.findFirst({
        where: {
            userId,
            isPaid: true,
            transactionReference: reference,
        },
        include: {
            cartItems: {
                include: {
                    course: true,
                }
            }
        }
    });

    const cartItems = cart?.cartItems.map((item) => ({
        id: item.course?.id,
        title: item.course?.title,
        thumbnail: item.course?.thumbnail,
        discountedFee: item.course?.discountedFee,
        originalFee: item.course?.originalFee,
        isFree: item.course?.isFree,
    })) || [];

    return {
        success: true,
        message: "Courses have been fetched successfully.",
        courses: cartItems || [],
    }
}

const queueCourseForAutoAssigning = async (userId: string, reference: string) => {
    // Mark the cart as paid
    const cart = await prisma.cart.findFirst({
        where: { userId, isPaid: false },
        include: { cartItems: true }
    });

    if (cart) {
        await prisma.cart.update({
            where: { id: cart.id },
            data: {
                isPaid: true,
                transactionReference: reference,
            }
        });
    }

    const courseIds: string[] = [];

    // Enroll the user in the purchased courses
    await Promise.all(
        (cart?.cartItems || []).map((item) => {
            courseIds.push(item.courseId);
            return prisma.student.upsert({
                where: {
                    userId_courseId: { userId, courseId: item.courseId }
                },
                update: {},
                create: { userId, courseId: item.courseId }
            });
        })
    );

    if (courseIds.length > 0) { // Send event to Inngest for further processing
        await inngest.send({
            name: 'course-content.requested',
            data: {
                userId,
                courseIds,
            }
        });
    }
}