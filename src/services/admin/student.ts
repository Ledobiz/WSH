'use server'

/* eslint-disable @typescript-eslint/no-explicit-any */

import prisma from "@/src/lib/prisma";
import { paginateQuery } from "@/src/utils/pagination";
import { inngest } from "@/src/inngest/client";

export const getAllStudents = async (page: number = 1, pageSize: number = 20, searchTerm?: string) => {
    try {
        const search = searchTerm?.trim();

        return await paginateQuery<any>({
            page,
            pageSize,
            dataQuery: ({ skip, take }) => prisma.user.findMany({
                where: {
                    role: 'student',
                    deletedAt: null,
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
                },
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
            countQuery: () => prisma.user.count({
                where: {
                    role: 'student',
                    deletedAt: null,
                    ...(search
                        ? {
                            OR: [
                                { name: { contains: search, mode: 'insensitive' } },
                                { email: { contains: search, mode: 'insensitive' } },
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
                }
            })
        });
    } catch (error) {
        console.log("Error fetching students:", error);
        return {
            students: [],
        };
    }
}

export const getStudentCourses = async (userId: string) => {
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

export const assignCourseToStudent = async (userId: string, courseId: string) => {
    try {
        const student = await prisma.student.findFirst({
            where: {
                userId,
                courseId,
                deletedAt: null
            }
        });

        if (student) {
            return {
                success: false,
                message: "Student is already enrolled in this course",
            };
        }

        const createdStudent = await prisma.student.create({
            data: {
                userId,
                courseId,
                courseContentAssigned: false,
            }
        });

        if (!createdStudent) {
            return {
                success: false,
                message: "Failed to assign course to student. Please try again",
            }
        }

        const courseIds = [courseId];

        await inngest.send({
            name: 'course-content.requested',
            data: {
                userId,
                courseIds,
            }
        });

        return {
            success: true,
            message: "Course assigned to student successfully",
        }
    } catch (error) {
        console.log("Error assigning course to student:", error);
        return {
            success: false,
            message: "Failed to assign course to student. Please try again",
        }
    }
}