'use server'

import * as z from "zod";
import { signInSchema, signUpSchema } from "../utils/auth_schemas";
import prisma from "../lib/prisma";
import { getUserByEmail } from "./user";
import { createUserSession, hashPassword, removeUserFromSession, verifyPassword } from "../utils/session";
import { cookies } from "next/headers";
import { getFirstErrorFromFieldSubmission } from "../utils/functions";

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

    const passwordIsCorrect = await verifyPassword(data.password, user.password);

    if (!passwordIsCorrect) {
        return {
            success: false,
            errors: 'Invalid login credentials',
        }
    }

    await createUserSession(user, await cookies())

    return {
        success: true,
        errors: null,
        message: 'Login was successful',
        user,
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

        await createUserSession(user, await cookies())

        return {
            success: true,
            errors: null,
            message: 'Registration success',
            user,
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
    await removeUserFromSession(await cookies());
}