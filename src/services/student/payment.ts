'use server'

import prisma from "@/src/lib/prisma";

export const paymentHistory = async (userId: string) => {
    try {
        const transactions = await prisma.transaction.findMany({
            where: {
                userId,
                deletedAt: null,
            },
            include: {
                carts: {
                    include: {
                        cartItems: {
                            include: {
                                course: true,
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            }
        });

        return {
            success: true,
            message: 'Payment history fetched successfully',
            transactions,
        }
    } catch (error) {
        console.log('Error fetching payment history', error);
    }
}