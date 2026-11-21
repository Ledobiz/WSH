// Enrollment logic shared by the admin "assign course" action and the free-course flow.
// Deliberately NOT a "use server" module, so it can't be called from the browser.
// Callers are responsible for authorisation.

import prisma from "@/src/lib/prisma";
import { inngest } from "@/src/inngest/client";

export const enrollStudentInCourse = async (userId: string, courseId: string, byAdmin: boolean) => {
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
                message: byAdmin ? "Student is already enrolled in this course" : 'Bad request! You have already enrolled into the course before.',
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
            message: byAdmin ? "Course assigned to student successfully" : 'Congratulations! You now have lifetime access to your free course',
        }
    } catch (error) {
        console.log("Error assigning course to student:", error);
        return {
            success: false,
            message: "Failed to assign course to student. Please try again",
        }
    }
}
