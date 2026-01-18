'use server';

/* eslint-disable @typescript-eslint/no-explicit-any */

import prisma from "@/src/lib/prisma";
import { paginateQuery } from "@/src/utils/pagination";

export const getDashboardData = async () => {
    try {
        const totalCourses = await prisma.course.count();
        const newReviews = await prisma.studentReview.count({
            where: {
                isReviewed: false
            }
        });
        const enrolledStudents = await prisma.student.count();

        // Get top 10 selling courses. Criterias are: by number of students enrolled
        const topSalesCourses = await prisma.course.findMany({
            where: { deletedAt: null },
            orderBy: {
                students: { _count: 'desc' }
            },
            take: 10,
            select: {
                id: true,
                title: true,
                slug: true,
                thumbnail: true,
                discountedFee: true,
                _count: {
                    select: { students: true }
                }
            }
        });

        const topSalesWithTotals = topSalesCourses.map((c) => ({
            ...c,
            totalSalePrice: (c._count?.students ?? 0) * c.discountedFee
        }));

        return {
            totalCourses,
            newReviews,
            enrolledStudents,
            topSalesCourses: topSalesWithTotals
        }
    } catch (error) {
        console.log("Error fetching dashboard data:", error);
        return {
            totalCourses: 0,
            newReviews: 0,
            enrolledStudents: 0,
            topSalesCourses: []
        };
    }
}

export const getSalesData = async (page: number = 1, pageSize: number = 20) => {
    try {
        const totalSale = await prisma.transaction.aggregate({
            _sum: {
                amount: true
            }
        });

        const salesInNumber = await prisma.transaction.count();

        // Total sale this month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const salesThisMonth = await prisma.transaction.aggregate({
            _sum: {
                amount: true
            },
            where: {
                createdAt: {
                    gte: startOfMonth,
                    lte: endOfMonth
                }
            }
        });

        const transactionHistory = await paginateQuery<any>({
            page,
            pageSize,
            dataQuery: ({ skip, take }) => prisma.transaction.findMany({
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take,
                include: {
                    carts: {
                        include: {
                            cartItems: {
                                include: {
                                    course: true
                                }
                            }
                        }
                    }
                }
            }),
            countQuery: () => prisma.transaction.count()
        });

        return {
            totalSalesAmount: totalSale._sum.amount || 0,
            salesThisMonth: salesThisMonth._sum.amount || 0,
            salesInNumber: salesInNumber,
            transactionHistory,
        };
    }
    catch (error) {
        console.log("Error fetching sales data:", error);
        return {
            totalSalesAmount: 0,
            salesThisMonth: 0,
            salesInNumber: 0,
            transactionHistory: [],
            pagination: {},
        };
    }
}