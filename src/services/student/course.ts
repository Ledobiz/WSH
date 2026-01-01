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

        if (!student) {
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
                    nextPrevious: {},
                }
            }
        }

        let currentModule = moduleId;
        let currentComponentId = componentId;
        let component = null;
        let studentModule = null;
        let lecturesCompleted = 0;
        let totalLectures = 0;

        if (student.lastLectureId) { // Check if there's a last lecture record
            // Get the component details
            const lastLectureComponent = await prisma.studentModuleComponent.findFirst({
                where: {
                    id: student.lastLectureId,
                    deletedAt: null
                }
            });

            if (lastLectureComponent) { // If the component exists, set the moduleId and componentId so that the lecture resumes from there
                moduleId = lastLectureComponent.studentModuleId;
                componentId = lastLectureComponent.id;
            }
        }

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

        // Record the last lecture accessed by the student
        await prisma.student.update({
            where: { id: student?.id },
            data: { lastLectureId: currentComponentId }
        });

        const modulesAndComponents = [];

        for (const mod of student?.studentModules || []) {
            const moduleComponents = await lectureModuleComponent(mod.id) as any[];

            modulesAndComponents.push({
                ...mod,
                components: moduleComponents
            });
        }

        // Count completed lectures from the modulesAndComponents
        for (const mod of modulesAndComponents) {
            for (const comp of mod.components) {
                totalLectures += 1;

                if (comp.lectureStatus === 'completed') {
                    lecturesCompleted += 1;
                }
            }
        }

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
                lecturesCompleted,
                totalLectures,
                nextPrevious: await getNextAndPreviousComponents(currentModule ?? '', currentComponentId ?? '', student.id)
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
                nextPrevious: {}
            }
        }
    }
}

export const lectureIsComplete = async (studentModuleId: string, studentModuleComponentId: string) => {
    try {
        // Insert or update the lecture record
        await prisma.studentLectureRecord.upsert({
            where: {
                studentModuleId_studentModuleComponentId: {
                    studentModuleId,
                    studentModuleComponentId
                }
            },
            update: {
                status: 'completed'
            },
            create: {
                studentModuleId,
                studentModuleComponentId,
                status: 'completed'
            }
        });

        return {
            success: true,
            message: 'Lecture marked as complete successfully.'
        };
    } catch (error) {
        console.log('Error marking lecture as complete:', error);
        return {
            success: false,
            message: 'Failed to mark lecture as complete. Please try again.'
        }
    }
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

const getNextAndPreviousComponents = async (
    currentModuleId: string,
    currentComponentId: string,
    studentId: string
) => {
    if (!currentModuleId || !currentComponentId) {
        return {
            previousComponent: null,
            nextComponent: null,
            previousModule: null,
            nextModule: null,
        };
    }

    // Ensure a deterministic module order (prefer sorting, fallback to createdAt)
    const allModules = await prisma.studentModule.findMany({
        where: {
            studentId,
            deletedAt: null,
            isActive: true,
        },
        orderBy: [
            { sorting: 'asc' },
            { createdAt: 'asc' },
        ],
    });

    const currentModuleIndex = allModules.findIndex(m => m.id === currentModuleId);
    if (currentModuleIndex === -1) {
        return {
            previousComponent: null,
            nextComponent: null,
            previousModule: null,
            nextModule: null,
        };
    }

    const currentModuleComponents = await lectureModuleComponent(currentModuleId) as any[];
    const currentComponentIndex = currentModuleComponents.findIndex(c => c.id === currentComponentId);

    let previousComponent = null;
    let nextComponent = null;

    // Default modules to the current module; switch only when crossing boundaries
    let previousModule: string | null = currentModuleId;
    let nextModule: string | null = currentModuleId;

    // Previous component: within current module or tail of previous module
    if (currentComponentIndex > 0) {
        // Stay within current module
        previousComponent = currentModuleComponents[currentComponentIndex - 1]?.id || null;
        previousModule = currentModuleId;
    } else if (currentModuleIndex > 0) {
        // Cross to previous module only if no previous component in current module
        previousModule = allModules[currentModuleIndex - 1]?.id || currentModuleId;
        const prevModuleComponents = await lectureModuleComponent(previousModule) as any[];
        previousComponent = prevModuleComponents[prevModuleComponents.length - 1]?.id || null;
    }

    // Next component: within current module or head of next module
    if (currentComponentIndex !== -1 && currentComponentIndex < currentModuleComponents.length - 1) {
        // Stay within current module
        nextComponent = currentModuleComponents[currentComponentIndex + 1]?.id || null;
        nextModule = currentModuleId;
    } else if (currentModuleIndex < allModules.length - 1) {
        // Cross to next module only if no next component in current module
        nextModule = allModules[currentModuleIndex + 1]?.id || currentModuleId;
        const nextModuleComponents = await lectureModuleComponent(nextModule) as any[];
        nextComponent = nextModuleComponents[0]?.id || null;
    }

    return {
        previousComponent,
        nextComponent,
        previousModule,
        nextModule,
    };
}