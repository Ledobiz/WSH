'use server';

import ContactUsEmail from "@/src/components/emails/ContactUsEmail";
import { render } from "@react-email/render";
import { Resend } from "resend";

export const sendMessageToCeo = async (name: string, email: string, subject: string, message: string) => {
    try {
        const resend = new Resend(process.env.RESEND_API_KEY!);

        const emailHtml = await render(
            ContactUsEmail({ message })
        );

        const { error } = await resend.emails.send({
            from: `${name} <${email}>`,
            to: 'support@womenskillshub.com',
            subject: subject,
            html: emailHtml,
        });

        if (error) {
            console.log('Error sending email to CEO', error);
            return {
                success: false,
                message: 'Failed to send message, please try again later.'
            }
        }

        return {
            success: true,
            message: 'Your message has been sent successfully.'
        }
    } catch (error) {
        console.log('Error sending message to CEO', error);

        return {
            success: false,
            message: 'Failed to send message, please try again later.'
        }
    }
}