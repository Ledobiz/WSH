'use server'

/* eslint-disable @typescript-eslint/no-explicit-any */

import prisma from "@/src/lib/prisma";
import { paginateQuery } from "@/src/utils/pagination";

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