'use server'

/* eslint-disable @typescript-eslint/no-explicit-any */

import prisma from "@/src/lib/prisma";
import { paginate, paginateQuery } from "@/src/utils/pagination";
import { Course } from "@prisma/client";

export const categoryCourses = async () => {
    try {
        const categories = await prisma.category.findMany({
            where: {
                deletedAt: null,
                // This ensures only categories with at least one non-deleted course are returned
                courses: {
                    some: {
                        isActive: true,
                        deletedAt: null
                    },
                },
            },
            include: {
                courses: {
                    where: {
                        isActive: true,
                        deletedAt: null
                    },
                    take: 8,
                    include: {
                        courseModules: {
                            where: {
                                isActive: true,
                                deletedAt: null,
                            },
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

export const singleCategoryCourses = async (slug: string) => {
    try {
        const category = await prisma.category.findFirst({
            where: {
                slug,
                deletedAt: null,
            },
            include: {
                courses: {
                    where: {
                        isActive: true,
                        deletedAt: null
                    },
                    include: {
                        courseModules: {
                            where: {
                                isActive: true,
                                deletedAt: null,
                            },
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
            category
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Unable to get the category and its courses',
            category: null,
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
                    isActive: true,
                    deletedAt: null,
                },
                include: {
                    moduleComponents: {
                        where: {
                            isActive: true,
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
                        isActive: true,
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

export const courseReviews = async (courseId: string, page: number = 1, pageSize: number = 20) => {
    try {
        return await paginateQuery<any>({
            page,
            pageSize,
            dataQuery: ({ skip, take }) => prisma.studentReview.findMany({
                where: {
                    courseId,
                    isApproved: true,
                    isReviewed: true
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take,
                include: {
                    user: true,
                    course: true,
                }
            }),
            countQuery: () => prisma.studentReview.count({
                where: {
                    courseId,
                    isApproved: true,
                    isReviewed: true
                }
            })
        });
    } catch (error) {
        console.log("Error fetching course reviews:", error);
        return {
            success: false,
            message: 'No result found',
            data: [],
            pagination: {
                totalCount: 0,
                totalPages: 0,
                currentPage: page,
                pageSize: pageSize,
            },
        }
    }
}