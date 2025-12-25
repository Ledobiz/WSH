'use server'

import prisma from "@/src/lib/prisma";

export const categoryCourses = async () => {
    try {
        const categories = await prisma.category.findMany({
            where: {
                deletedAt: null,
                // This ensures only categories with at least one non-deleted course are returned
                courses: {
                    some: { deletedAt: null },
                },
            },
            include: {
                courses: {
                    where: { deletedAt: null },
                    take: 8,
                    include: {
                        courseModules: {
                            where: { deletedAt: null },
                            include: {
                                moduleComponents: {
                                    where: { deletedAt: null }
                                }
                            }
                        }
                    }
                },
            },
        });

        return {
            success: true,
            message: 'Success',
            categories
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Something went wrong',
            categories: [],
        }
    }
}

export const ongoingCourses = async (userId: string) => {
    try {
        const courses = await prisma.student.findMany({
            where: {
                userId,
                deletedAt: null
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                course: true,
                studentModules: {
                    where: {
                        deletedAt: null,
                    },
                    include: {
                        studentModuleComponents: {
                            where: {
                                deletedAt: null
                            }
                        }
                    }
                }
            }
        });

        return {
            success: true,
            message: 'Success',
            courses,
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Something went wrong',
            courses: []
        }
    }
}