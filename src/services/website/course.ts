'use server'

import prisma from "@/src/lib/prisma";
import { paginate } from "@/src/utils/pagination";
import { Course } from "@prisma/client";
import { success } from "zod";

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

export const allCoursesForWebsite = async (page: number = 1, pageSize: number = 20) => {
    return await paginate<Course>(prisma.course, {
        page,
        pageSize,
        where: {
            isActive: true,
            deletedAt: null,
        },
        include: {
            courseModules: {
                where: {
                    deletedAt: null,
                },
                include: {
                    moduleComponents: {
                        where: {
                            deletedAt: null,
                        }
                    }
                }
            }
        }
    });
}

export const singleCourseWebsite = async (slug: string) => {
    try {
        const course = await prisma.course.findFirst({
            where: {
                slug,
                deletedAt: null,
            },
            include: {
                students: true,
                courseModules: {
                    where: {
                        deletedAt: null,
                    },
                    include: {
                        moduleComponents: {
                            where: {
                                deletedAt: null,
                            }
                        }
                    }
                }
            }
        });

        return {
            success: true,
            message: 'Success',
            course
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Unable to locate the course',
            course: null,
        }
    }
}