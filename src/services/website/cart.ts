'use server'

import { inngest } from "@/src/inngest/client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import prisma from "@/src/lib/prisma";

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
            courseFee = course.discountedFee || 0;
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

export const verifyTransaction = async (paymentId: string, userId: string) => {
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

        console.log('Transaction verification response:', data);

        if (data.status === 'success' && data.data.status === 'successful') {
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });

            // Record the payment
            await prisma.transaction.create({
                data: {
                    userId: userId,
                    reference: data.data.tx_ref,
                    gateway: 'Flutterwave',
                    name: user ? user.name : 'Unknown',
                    email: user ? user.email : '',
                    phone: user ? user.phone : '',
                    currency: data.data.currency,
                    amount: data.data.amount,
                    first4Digits: data.data.card?.first_6digits || '',
                    last4Digits: data.data.card?.last_4digits || '',
                    cardBrand: data.data.card?.type || '',
                    status: 'success',
                }
            });

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
                        transactionReference: data.data.tx_ref,
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

            return { success: true, message: "Transaction verified successfully" };
        }

        return { success: false, message: "Payment verification failed. Please contact WSH support if you have been charged" };
    } catch (error) {
        console.error("Transaction verification error:", error);
        return { success: false, message: "Transaction verification failed" };
    }
}