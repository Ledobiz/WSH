'use server'

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