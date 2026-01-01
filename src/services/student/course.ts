'use server'

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Resend } from "resend";
import ConfirmationEmail from "@/src/components/emails/ConfirmationEmail";
import prisma from "@/src/lib/prisma";
import { render } from "@react-email/render";
import { Prisma } from "@prisma/client";

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

export const myLecture = async (userId?: string, courseId?: string, moduleId?: string, componentId?: string) => {
    try {
        const student = await prisma.student.findFirst({
            where: {
                userId,
                courseId,
                deletedAt: null
            },
            include: {
                course: true,
                studentModules: {
                    where: {
                        deletedAt: null
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

        let currentModule = moduleId;
        let currentComponentId = componentId;
        let component = null;
        let studentModule = null;

        if (!moduleId) { // Fetch the first module and its first component if moduleId is not provided
            studentModule = await prisma.studentModule.findFirst({
                where: {
                    studentId: student?.id,
                    isActive: true,
                    deletedAt: null
                },
                include: {
                    studentModuleComponents: {
                        where: {
                            deletedAt: null
                        }
                    }
                },
                orderBy: {
                    createdAt: 'asc'
                },
            });

            // Get the first component of the module
            if (studentModule) {
                const moduleComponent = await prisma.$queryRaw<
                    Array<{
                        id: string;
                        lectureRecordId: string | null;
                        lectureStatus: string | null;
                        [key: string]: any;
                    }>
                >(Prisma.sql`
                    SELECT smc.*, slr."id" AS "lectureRecordId", slr."status" AS "lectureStatus"
                    FROM "StudentModuleComponent" smc
                    LEFT JOIN "StudentLectureRecord" slr
                        ON slr."studentModuleComponentId" = smc."id"
                        AND slr."studentModuleId" = ${studentModule.id}
                        AND slr."deletedAt" IS NULL
                    WHERE smc."studentModuleId" = ${studentModule.id}
                        AND smc."deletedAt" IS NULL
                    ORDER BY smc."createdAt" ASC
                    LIMIT 1
                `);

                if (moduleComponent.length > 0) {
                    component = moduleComponent[0];
                    currentComponentId = component.id;
                }

                currentModule = studentModule.id;
            }
        }
        else {
            // Fetch the specificed module
            studentModule = await prisma.studentModule.findFirst({
                where: {
                    id: moduleId,
                    studentId: student?.id,
                    isActive: true,
                    deletedAt: null
                },
                orderBy: {
                    createdAt: 'asc'
                },
            });

            // Get the first component of the module
            if (studentModule) {
                const moduleComponent = await prisma.$queryRaw<
                    Array<{
                        id: string;
                        lectureRecordId: string | null;
                        lectureStatus: string | null;
                        [key: string]: any;
                    }>
                >(Prisma.sql`
                    SELECT smc.*, slr."id" AS "lectureRecordId", slr."status" AS "lectureStatus"
                    FROM "StudentModuleComponent" smc
                    LEFT JOIN "StudentLectureRecord" slr
                        ON slr."studentModuleComponentId" = smc."id"
                        AND slr."studentModuleId" = ${studentModule.id}
                        AND slr."deletedAt" IS NULL
                    WHERE smc."studentModuleId" = ${studentModule.id}
                        AND smc."id" = ${componentId}
                        AND smc."deletedAt" IS NULL
                    ORDER BY smc."createdAt" ASC
                    LIMIT 1
                `);

                if (moduleComponent.length > 0) {
                    component = moduleComponent[0];
                    currentComponentId = component.id;
                }

                currentModule = studentModule.id;
            }
        }

        const modulesAndComponents = [];

        for (const mod of student?.studentModules || []) {
            const moduleComponents = await lectureModuleComponent(mod.id) as any[];

            modulesAndComponents.push({
                ...mod,
                components: moduleComponents
            });
        }

        console.log('Modules and Components:', modulesAndComponents);

        return {
            success: true,
            message: 'Success',
            data: {
                currentModuleId: currentModule,
                currentComponentId,
                currentComponent: component,
                currentModuleData: studentModule,
                modulesAndComponents,
                student,
                course: student?.course || null,
            }
        }
    }
    catch (error) {
        console.log('Error fetching lecture:', error);
        return {
            success: false,
            message: 'Something went wrong',
            data: {
                currentModuleId: null,
                currentComponentId: null,
                currentComponent: null,
                currentModuleData: {},
                allComponents: [],
                student: {},
                course: null,
            }
        }
    }
}

const lectureModuleComponent = async (studentModuleId: string) => {
    return await prisma.$queryRaw(Prisma.sql`
        SELECT smc.*, slr."id" AS "lectureRecordId", slr."status" AS "lectureStatus"
        FROM "StudentModuleComponent" smc
        LEFT JOIN "StudentLectureRecord" slr
            ON slr."studentModuleComponentId" = smc."id"
            AND slr."studentModuleId" = ${studentModuleId}
            AND slr."deletedAt" IS NULL
        WHERE smc."studentModuleId" = ${studentModuleId}
            AND smc."deletedAt" IS NULL
        ORDER BY smc."createdAt" ASC
    `);
}

export const populateCourseContentForStudent = async (userId: string, courseId: string) => {
    try {
        const student = await prisma.student.findFirst({
            where: {
                userId,
                courseId,
                deletedAt: null
            }
        });

        if (!student) {
            console.log(`Student with User ID ${userId} is not enrolled in course with ID ${courseId}.`);
            return;
        }

        if (student.courseContentAssigned) {
            console.log(`Course content already assigned to student with User ID ${userId} for course ID ${courseId}.`);
            return;
        }

        const modules = await prisma.courseModule.findMany({
            where: {
                courseId,
                isActive: true,
                deletedAt: null
            },
            include: {
                moduleComponents: {
                    where: {
                        isActive: true,
                        deletedAt: null
                    }
                }
            }
        });

        await prisma.$transaction(async (prisma) => {
            for (const currentModule of modules) {
                const studentModule = await prisma.studentModule.create({
                    data: {
                        studentId: student.id,
                        courseModuleId: currentModule.id,
                        name: currentModule.name,
                        description: currentModule.description,
                        sorting: currentModule.sorting,
                        totalDuration: currentModule.totalDuration,
                    }
                });

                // Populate the component of the module to the student.
                for (const component of currentModule.moduleComponents) {
                    await prisma.studentModuleComponent.create({
                        data: {
                            studentId: student.id,
                            studentModuleId: studentModule.id,
                            moduleComponentId: component.id,
                            name: component.name,
                            description: component.description,
                            type: component.type,
                            vimeoVideoUrl: component.vimeoVideoUrl,
                            embedVideoUrl: component.embedVideoUrl,
                            fileName: component.fileName,
                            fileNamePublicId: component.fileNamePublicId,
                            isPrerequisite: component.isPrerequisite,
                            isFree: component.isFree,
                            sorting: component.sorting,
                            duration: component.duration,
                        }
                    });
                }
            }
        });

        await prisma.student.update({
            where: { id: student.id },
            data: { courseContentAssigned: true }
        });

        return {
            success: true,
            message: 'Course contents have been populated for the student successfully.'
        }
    } catch (error) {
        console.log('Error populating course content for student:', error);

        return {
            success: false,
            message: 'Failed to populate course contents for the student. Please try again.'
        }
    }
}

export const sendCourseConfirmationEmail = async (userId: string, courseId: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        const course = await prisma.course.findUnique({
            where: { id: courseId }
        });

        if (user && course) {
            const resend = new Resend(process.env.RESEND_API_KEY!);

            const emailHtml = await render(
                ConfirmationEmail({
                    studentName: user.name || 'Student',
                    courseName: course.title
                })
            );

            const { error } = await resend.emails.send({
                from: 'WSH Academy <academy@wsh.com>',
                to: user.email,
                subject: 'Welcome Aboard! Your Course Enrolment is Confirmed',
                html: emailHtml,
            });

            if (error) {
                console.log('Error sending course confirmation email:', error);
                return {
                    success: false,
                    message: 'Failed to send course confirmation email.'
                }
            }

            return {
                success: true,
                message: 'Course confirmation email sent successfully.'
            }
        }
        return {
            success: false,
            message: 'User or Course not found.'
        }
    } catch (error) {
        console.log('Error sending course confirmation email:', error);

        return {
            success: false,
            message: 'Failed to send course confirmation email.'
        }
    }
}