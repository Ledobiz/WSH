'use server'

import * as z from "zod";
import { signInSchema, signUpSchema } from "@/src/validations/auth_validation";
import prisma from "@/src/lib/prisma";
import { getUserByEmail } from "./user";
import { hashPassword, verifyPassword } from "@/src/utils/server_functions";
import { getFirstErrorFromFieldSubmission } from "@/src/utils/client_functions";
import { createUserSession, removeUserFromSession, SESSION_TTL } from "@/src/utils/jwt";
import { Resend } from "resend";
import { render } from "@react-email/render";
import PasswordResetEmail from "../components/emails/PasswordResetEmail";

export async function signIn(unsafeData: z.infer<typeof signInSchema>) {
    const { success, data, error } = signInSchema.safeParse(unsafeData)

    if (!success) {
        return {
            success: false,
            errors: getFirstErrorFromFieldSubmission(error.flatten().fieldErrors),
            message: 'Validation error'
        }
    }

    const user = await getUserByEmail(data.email);

    if (user == null) {
        return {
            success: false,
            errors: 'Invalid login credentials',
        }
    }

    if (!user.password) {
        return {
            success: false,
            errors: 'Invalid login credentials',
        }
    }

    const passwordIsCorrect = await verifyPassword(data.password, user.password!);

    if (!passwordIsCorrect) {
        return {
            success: false,
            errors: 'Invalid login credentials',
        }
    }

    if (!user.name) {
        return {
            success: false,
            errors: 'User account is missing required information',
        }
    }

    await createUserSession({
        id: user.id,
        name: user.name!,
        email: user.email,
        phone: user.phone ?? null,
        image: user.image ?? null,
        uid: user.uid ?? null,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
    });

    return {
        success: true,
        errors: null,
        message: 'Login was successful',
        user,
        expiresAt: SESSION_TTL
    }
}

export async function signUp(unsafeData: z.infer<typeof signUpSchema>) {
    const { success, error, data } = signUpSchema.safeParse(unsafeData)

    if (!success) {
        return {
            success: false,
            errors: getFirstErrorFromFieldSubmission(error.flatten().fieldErrors),
            message: 'Validation error'
        }
    }

    const existingUser = await getUserByEmail(data.email);

    if (existingUser != null) {
        return {
            success: false,
            errors: 'Account already exists for this email',
            message: 'Validation error'
        }
    }

    try {
        const hashedPassword = await hashPassword(data.password);

        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: 'student',
                isActive: true,
            }
        })

        if (user == null) {
            return {
                success: false,
                errors: 'Something went wrong. Please try',
                message: null
            }
        }

        if (!user.name) {
            return {
                success: false,
                errors: 'User account is missing required information',
            }
        }

        await createUserSession({
            id: user.id,
            name: user.name!,
            email: user.email,
            phone: user.phone ?? null,
            image: user.image ?? null,
            uid: user.uid ?? null,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
        })

        return {
            success: true,
            errors: null,
            message: 'Registration success',
            user,
            expiresAt: SESSION_TTL
        }
    } catch (error) {
        console.log(error);

        return {
            success: false,
            errors: 'Something went wrong. Please try',
            message: null
        }
    }
}

export async function logOut() {
    await removeUserFromSession();
}

export async function resetPassword(email: string) {
    const user = await getUserByEmail(email);

    if (!user) {
        return {
            success: false,
            message: 'It seems like you do not have an account with us. No record of this email was found.',
        }
    }

    try {
        const resend = new Resend(process.env.RESEND_API_KEY!);

        const token = crypto.randomUUID();
        await prisma.user.update({
            where: { email: user.email },
            data: { token }
        });

        const emailHtml = await render(
            PasswordResetEmail({
                userName: user.name!,
                email: user.email,
                token,
            })
        );

        const { error } = await resend.emails.send({
            from: 'Women Skills Hub <support@womenskillshub.com>',
            to: user.email,
            subject: 'Reset Your Password',
            html: emailHtml,
        });

        if (error) {
            console.log('Error sending password reset email:', error);
            return {
                success: false,
                message: 'Failed to send password reset email. Please try again later.',
            }
        }

        return {
            success: true,
            message: 'Password reset email sent successfully. Please check your inbox.',
        }
    }
    catch (error) {
        console.log('Error in resetPassword function:', error);
        return {
            success: false,
            message: 'Failed to send course confirmation email.'
        }
    }
}