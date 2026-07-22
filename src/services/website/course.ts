'use server'

/* eslint-disable @typescript-eslint/no-explicit-any */

import prisma from "@/src/lib/prisma";
import { paginate, paginateQuery } from "@/src/utils/pagination";
import { Course } from "@prisma/client";

type WebsiteCoursesFilters = {
    pageSize?: number;
    search?: string;
    categorySlug?: string;
};

const publishedCourseWhere = {
    isActive: true,
    deletedAt: null,
} as const;

/** Slug, display name, and count of active courses — for nav / compact UIs */
export const fetchNavbarCategories = async () => {
    try {
        const rows = await prisma.category.findMany({
            where: {
                deletedAt: null,
                courses: { some: publishedCourseWhere },
            },
            select: {
                name: true,
                slug: true,
                _count: {
                    select: {
                        courses: { where: publishedCourseWhere },
                    },
                },
            },
            orderBy: { name: "asc" },
        });

        const categories = rows.map((row) => ({
            name: row.name,
            slug: row.slug,
            count: row._count.courses,
        }));

        return {
            success: true,
            message: "Success",
            categories,
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Something went wrong",
            categories: [] as { name: string; slug: string; count: number }[],
        };
    }
};

export const categoryCourses = async () => {
    try {
        const categories = await prisma.category.findMany({
            where: {
                deletedAt: null,
                // This ensures only categories with at least one non-deleted course are returned
                courses: {
                    some: publishedCourseWhere,
                },
            },
            include: {
                courses: {
                    where: publishedCourseWhere,
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

export const homepageCourses = async () => {
    try {
        const courses = await prisma.course.findMany({
            where: {
                isActive: true,
                deletedAt: null,
            },
            take: 8
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
            message: 'Something went wrong. Unable to fetch courses',
            courses: [],
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

export const allCoursesForWebsite = async (
    page: number = 1,
    filters: WebsiteCoursesFilters = {}
) => {
    const pageSize = filters.pageSize ?? 20;
    const normalizedSearch = filters.search?.trim();

    return await paginate<Course>(prisma.course, {
        page,
        pageSize,
        where: {
            isActive: true,
            deletedAt: null,
            ...(normalizedSearch
                ? {
                    title: {
                        contains: normalizedSearch,
                        mode: "insensitive",
                    }
                }
                : {}),
            ...(filters.categorySlug
                ? {
                    category: {
                        slug: filters.categorySlug,
                    }
                }
                : {}),
        },
        include: {
            category: true,
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
                category: true,
                students: true,
                courseModules: {
                    where: {
                        isActive: true,
                        deletedAt: null,
                    },
                    orderBy: [
                        { sorting: { sort: 'asc', nulls: 'last' } },
                        { createdAt: 'asc' },
                    ],
                    include: {
                        moduleComponents: {
                            where: {
                                deletedAt: null,
                            },
                            orderBy: [
                                { sorting: { sort: 'asc', nulls: 'last' } },
                                { createdAt: 'asc' },
                            ]
                        }
                    }
                }
            }
        });

        if (!course) {
            return {
                success: false,
                message: 'Unable to locate the course',
                course: null,
                rating: { average: 0, count: 0 },
            }
        }

        const ratingAgg = await prisma.studentReview.aggregate({
            where: {
                courseId: course.id,
                isApproved: true,
                isReviewed: true,
            },
            _avg: { rating: true },
            _count: { _all: true },
        });

        return {
            success: true,
            message: 'Success',
            course,
            rating: {
                average: ratingAgg._avg.rating ?? 0,
                count: ratingAgg._count._all,
            },
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Unable to locate the course',
            course: null,
            rating: { average: 0, count: 0 },
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