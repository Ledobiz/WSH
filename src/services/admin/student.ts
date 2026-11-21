'use server'

/* eslint-disable @typescript-eslint/no-explicit-any */

import prisma from "@/src/lib/prisma";
import { paginateQuery } from "@/src/utils/pagination";
import { inngest } from "@/src/inngest/client";
import { requireAdmin } from "@/src/lib/auth-guard";
import { enrollStudentInCourse } from "@/src/lib/enrollment";
import { removeStudentFromCourse, giveStudentNewlyAvailableLectureContents } from "@/src/services/student/course";
import { courseProgress } from "@/src/utils/progress_functions";

export type StudentListFilters = {
    status?: 'all' | 'active' | 'inactive';
    // ISO timestamps. The client converts the admin's local calendar dates
    // into [registeredFrom, registeredTo) so timezone boundaries are correct.
    registeredFrom?: string;
    registeredTo?: string;
};

const parseDate = (value?: string) => {
    if (!value) return undefined;
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date;
};

export const getAllStudents = async (
    page: number = 1,
    pageSize: number = 20,
    searchTerm?: string,
    filters: StudentListFilters = {},
) => {
    await requireAdmin();
    try {
        const search = searchTerm?.trim();
        const from = parseDate(filters.registeredFrom);
        const to = parseDate(filters.registeredTo);

        const where: any = {
            role: 'student',
            deletedAt: null,
            ...(filters.status === 'active' ? { isActive: true } : {}),
            ...(filters.status === 'inactive' ? { isActive: false } : {}),
            ...(from || to
                ? {
                    createdAt: {
                        ...(from ? { gte: from } : {}),
                        ...(to ? { lt: to } : {}),
                    }
                }
                : {}
            ),
            ...(search
                ? {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } },
                        // Match enrolled course titles via Student relation
                        {
                            students: {
                                some: {
                                    deletedAt: null,
                                    course: {
                                        title: { contains: search, mode: 'insensitive' }
                                    }
                                }
                            }
                        }
                    ],
                }
                : {}
            ),
        };

        return await paginateQuery<any>({
            page,
            pageSize,
            dataQuery: ({ skip, take }) => prisma.user.findMany({
                where,
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take,
                include: {
                    students: {
                        where: { deletedAt: null },
                        include: {
                            course: true
                        }
                    }
                }
            }),
            countQuery: () => prisma.user.count({ where })
        });
    } catch (error) {
        console.log("Error fetching students:", error);
        return {
            success: false,
            message: 'Failed to fetch students',
            data: [],
            pagination: {
                totalCount: 0,
                totalPages: 0,
                currentPage: page,
                pageSize,
            },
        };
    }
}

export const getStudentStats = async () => {
    await requireAdmin();
    try {
        const [total, active] = await Promise.all([
            prisma.user.count({ where: { role: 'student', deletedAt: null } }),
            prisma.user.count({ where: { role: 'student', deletedAt: null, isActive: true } }),
        ]);
        return { total, active };
    } catch (error) {
        console.log("Error fetching student stats:", error);
        return { total: 0, active: 0 };
    }
}

export const getStudentCourses = async (userId: string) => {
    await requireAdmin();
    try {
        const courses = await prisma.student.findMany({
            where: {
                userId,
                deletedAt: null
            },
            include: {
                course: true,
                studentModules: {
                    where: { deletedAt: null },
                    include: {
                        studentModuleComponents: true,
                    }
                }
            }
        });

        const otherCourses = await prisma.course.findMany({
            where: {
                deletedAt: null,
                isActive: true,
                students: {
                    none: {
                        userId
                    }
                }
            }
        })

        return {
            courses,
            otherCourses,
        };
    } catch (error) {
        console.log("Error fetching student courses:", error);
        return {
            courses: [],
            otherCourses: [],
        };
    }
}

export const getStudentCourseContent = async (userId: string, courseId: string) => {
    await requireAdmin();
    try {
        // The student's OWN copy of the content (StudentModule / StudentModuleComponent),
        // which can lag behind the master course until an admin refreshes it.
        const student = await prisma.student.findFirst({
            where: {
                userId,
                courseId,
                deletedAt: null,
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
                course: { select: { id: true, title: true } },
                studentModules: {
                    where: { deletedAt: null },
                    orderBy: [
                        { sorting: { sort: 'asc', nulls: 'last' } },
                        { createdAt: 'asc' },
                    ],
                    include: {
                        studentModuleComponents: {
                            where: { deletedAt: null },
                            orderBy: [
                                { sorting: { sort: 'asc', nulls: 'last' } },
                                { createdAt: 'asc' },
                            ],
                            include: {
                                studentLectureRecords: {
                                    where: { deletedAt: null },
                                    select: { status: true },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!student) {
            return {
                success: false,
                message: 'This student is not enrolled in the course.',
                student: null,
            };
        }

        return {
            success: true,
            message: 'Success',
            student,
        };
    } catch (error) {
        console.log("Error fetching student course content:", error);
        return {
            success: false,
            message: "Failed to load the student's course content.",
            student: null,
        };
    }
}

export const assignCourseToStudent = async (userId: string, courseId: string) => {
    await requireAdmin();
    return enrollStudentInCourse(userId, courseId, true);
}

export const courseReviews = async (page: number = 1, pageSize: number = 20) => {
    await requireAdmin();
    try {
        return await paginateQuery<any>({
            page,
            pageSize,
            dataQuery: ({ skip, take }) => prisma.studentReview.findMany({
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
            countQuery: () => prisma.studentReview.count()
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

export const replyToCourseReview = async (reviewId: string, replyComment: string) => {
    await requireAdmin();
    try {
        await prisma.studentReview.update({
            where: { id: reviewId },
            data: {
                reply: replyComment,
                isApproved: true,
                isReviewed: true,
                replyDate: new Date(),
            }
        });

        return {
            success: true,
            message: "Reply has been submitted successfully. The review will now appear on the website.",
        };
    }
    catch (error) {
        console.log("Error replying to course review:", error);
        return {
            success: false,
            message: "Failed to submit reply. Please try again",
        }
    }
}

export const approveReviewWithoutReply = async (reviewId: string) => {
    await requireAdmin();
    try {
        await prisma.studentReview.update({
            where: { id: reviewId },
            data: {
                isApproved: true,
                isReviewed: true,
            }
        });
        return {
            success: true,
            message: "The review has been approved successfully. It will now appear on the website.",
        };
    }
    catch (error) {
        console.log("Error approving course review:", error);
        return {
            success: false,
            message: "Failed to approve review. Please try again",
        }
    }
}

export const markAsReviewedWithoutApproval = async (reviewId: string) => {
    await requireAdmin();
    try {
        await prisma.studentReview.update({
            where: { id: reviewId },
            data: {
                isApproved: false,
                isReviewed: true,
            }
        });
        return {
            success: true,
            message: "The review has been marked as reviewed. It will not appear on the website.",
        };
    }
    catch (error) {
        console.log("Error marking course review as reviewed:", error);
        return {
            success: false,
            message: "Failed to mark review as reviewed. Please try again",
        }
    }
}

export const getCourseStudents = async (courseId: string, page: number = 1, pageSize: number = 20, searchTerm?: string) => {
    await requireAdmin();
    try {
        const search = searchTerm?.trim();

        const result = await paginateQuery<any>({
            page,
            pageSize,
            dataQuery: ({ skip, take }) => prisma.student.findMany({
                where: {
                    courseId,
                    deletedAt: null,
                    ...(search
                        ? {
                            user: {
                                OR: [
                                    { name: { contains: search, mode: 'insensitive' } },
                                    { email: { contains: search, mode: 'insensitive' } },
                                ]
                            }
                        }
                        : {}
                    ),
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            gender: true,
                            country: true,
                            city: true,
                            state: true,
                            phone: true,
                            createdAt: true,
                        }
                    },
                    course: {
                        select: {
                            id: true,
                            title: true,
                        }
                    }
                }
            }),
            countQuery: () => prisma.student.count({
                where: {
                    courseId,
                    deletedAt: null,
                    ...(search
                        ? {
                            user: {
                                OR: [
                                    { name: { contains: search, mode: 'insensitive' } },
                                    { email: { contains: search, mode: 'insensitive' } },
                                ]
                            }
                        }
                        : {}
                    ),
                }
            })
        });

        // Add lecture progress for each student
        if (result.success && result.data) {
            const studentsWithProgress = await Promise.all(
                (result.data as any[]).map(async (student) => {
                    const progress = await courseProgress(student.userId, courseId);
                    return {
                        ...student,
                        lecturesCompleted: progress.lecturesCompleted,
                        totalLectures: progress.totalLectures,
                    };
                })
            );

            return {
                ...result,
                data: studentsWithProgress,
            };
        }

        return result;
    } catch (error) {
        console.log("Error fetching course students:", error);
        return {
            success: false,
            message: 'Failed to fetch students',
            data: [],
            pagination: {
                totalCount: 0,
                totalPages: 0,
                currentPage: page,
                pageSize: pageSize,
            },
        };
    }
}

export const bulkRemoveStudentsFromCourse = async (courseId: string, studentIds: string[]) => {
    await requireAdmin();
    try {
        if (!studentIds || studentIds.length === 0) {
            return {
                success: false,
                message: "No students selected",
            };
        }

        // Verify all students belong to this course
        const students = await prisma.student.findMany({
            where: {
                id: { in: studentIds },
                courseId,
                deletedAt: null
            }
        });

        if (students.length !== studentIds.length) {
            return {
                success: false,
                message: "Some selected students are not enrolled in this course",
            };
        }

        // Use the existing removeStudentFromCourse logic for each student
        const results = await Promise.allSettled(
            students.map(student => removeStudentFromCourse(student.userId, courseId))
        );

        const failed = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success));

        if (failed.length > 0) {
            return {
                success: false,
                message: `Failed to remove ${failed.length} student(s) from the course`,
            };
        }

        return {
            success: true,
            message: `Successfully removed ${students.length} student(s) from the course`,
        };
    } catch (error) {
        console.log("Error bulk removing students from course:", error);
        return {
            success: false,
            message: "Failed to remove students from course. Please try again",
        };
    }
}

export const bulkUpdateStudentLectures = async (courseId: string, studentIds: string[]) => {
    await requireAdmin();
    try {
        if (!studentIds || studentIds.length === 0) {
            return {
                success: false,
                message: "No students selected",
            };
        }

        // Verify all students belong to this course
        const students = await prisma.student.findMany({
            where: {
                id: { in: studentIds },
                courseId,
                deletedAt: null
            }
        });

        if (students.length !== studentIds.length) {
            return {
                success: false,
                message: "Some selected students are not enrolled in this course",
            };
        }

        // Update lecture contents for each student
        const results = await Promise.allSettled(
            students.map(student => giveStudentNewlyAvailableLectureContents(student.userId, courseId))
        );

        const failed = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success));

        if (failed.length > 0) {
            return {
                success: false,
                message: `Failed to update lectures for ${failed.length} student(s)`,
            };
        }

        return {
            success: true,
            message: `Successfully updated lectures for ${students.length} student(s)`,
        };
    } catch (error) {
        console.log("Error bulk updating student lectures:", error);
        return {
            success: false,
            message: "Failed to update student lectures. Please try again",
        };
    }
}