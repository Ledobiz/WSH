import { inngest } from "./client";
import { populateCourseContentForStudent, sendCourseConfirmationEmail } from "../services/student/course";

export const courseContentProvider = inngest.createFunction(
    {
        id: 'course-content-provider',
        name: 'Course Content Provider'
    },
    { event: 'course-content.requested' },
    async ({ event, step }) => {
        const { userId, courseIds } = event.data;

        await step.run('Provide Course Content', async () => { // Process the request and provide course content
            for (const courseId of courseIds) {
                await populateCourseContentForStudent(userId, courseId);
            }

            return { message: 'Course content provided successfully.' };
        });

        await step.run('Send Confirmation Email To User', async () => {
            try {
                console.log('Sending course confirmation emails to user:', userId, courseIds);
                for (const courseId of courseIds) {
                    await sendCourseConfirmationEmail(userId, courseId);
                }
                return { message: 'Course confirmation emails sent successfully.' };
            }
            catch (error) {
                console.error("Error sending confirmation emails:", error);
                return { message: 'Failed to send some or all course confirmation emails.', error };
            }
        });

        return {
            message: 'Course content provided successfully to student with userId ' + userId,
            courseIdsProvided: courseIds
        }
    }
);