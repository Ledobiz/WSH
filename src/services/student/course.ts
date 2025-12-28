'use server'

import { Resend } from "resend";
import ConfirmationEmail from "@/src/components/emails/ConfirmationEmail";
import prisma from "@/src/lib/prisma";
import { render } from "@react-email/render";

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