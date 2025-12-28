import { inngest } from "./client";

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
                // Here you would typically fetch course content from a database
                // and send it to the user. This is a placeholder implementation.
                console.log(`Providing content for course ${courseId} to user ${userId}`);

            }
        });

        await step.run('Send Confirmation Email To User', async () => {
            // Here you would typically send an email to the user confirming
            // that the course content has been provided. This is a placeholder implementation.
            console.log(`Sent confirmation email to user ${userId} for courses: ${courseIds.join(', ')}`);
        });
    }
);