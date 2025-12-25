'use server'

import * as z from "zod";
import prisma from "@/src/lib/prisma";

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