'use server';

/* eslint-disable @typescript-eslint/no-explicit-any */

import prisma from "@/src/lib/prisma";

export const getDashboardData = async () => {
    try {
        const totalCourses = await prisma.course.count();
        const totalUsers = await prisma.user.count({
            where: {
                role: 'student'
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
            totalUsers,
            enrolledStudents,
            topSalesCourses: topSalesWithTotals
        }
    } catch (error) {
        console.log("Error fetching dashboard data:", error);
        return {
            totalCourses: 0,
            totalUsers: 0,
            enrolledStudents: 0,
            topSalesCourses: []
        };
    }
}