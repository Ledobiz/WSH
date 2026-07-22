'use server'

import * as z from "zod";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { signInSchema, signUpSchema } from "@/src/validations/auth_validation";
import prisma from "@/src/lib/prisma";
import { getUserByEmail, getUserByUid, createNewStudent } from "./user";
import { hashPassword, verifyPassword } from "@/src/utils/server_functions";
import { getFirstErrorFromFieldSubmission } from "@/src/utils/client_functions";
import { createUserSession, removeUserFromSession, SESSION_TTL } from "@/src/utils/jwt";
import { Resend } from "resend";
import { render } from "@react-email/render";
import PasswordResetEmail from "../components/emails/PasswordResetEmail";

// Google verifies ID tokens with rotating public keys; jose fetches & caches them.
const GOOGLE_ISSUERS = ["https://accounts.google.com", "accounts.google.com"];
const googleJwks = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));

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

/**
 * Signs a user in with a Google ID token (from Google Identity Services on the client).
 *
 * Account linking: we look the user up by Google id first, then by verified email. That
 * second step is what lets students who originally registered with email + password sign
 * in with Google — their existing account is found by email and the Google id is attached
 * to it, so it's the same account either way. Brand-new emails create a fresh student.
 */
export async function signInWithGoogle(idToken: string) {
    if (!idToken) {
        return { success: false, errors: "Missing Google credential" };
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
        console.log("signInWithGoogle: NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured");
        return { success: false, errors: "Google sign-in is not configured" };
    }

    // 1. Verify the token's signature, audience and issuer with Google's public keys.
    let payload: Record<string, unknown>;
    try {
        const verified = await jwtVerify(idToken, googleJwks, {
            issuer: GOOGLE_ISSUERS,
            audience: clientId,
        });
        payload = verified.payload as Record<string, unknown>;
    } catch (error) {
        console.log("signInWithGoogle: token verification failed", error);
        return { success: false, errors: "Could not verify your Google sign-in. Please try again." };
    }

    const sub = typeof payload.sub === "string" ? payload.sub : null;
    const email = typeof payload.email === "string" ? payload.email.toLowerCase() : null;
    const emailVerified = payload.email_verified === true || payload.email_verified === "true";
    const picture = typeof payload.picture === "string" ? payload.picture : null;
    const googleName = typeof payload.name === "string" ? payload.name : null;

    if (!sub || !email) {
        return { success: false, errors: "Your Google account did not return an email." };
    }

    // Only trust the email for account linking if Google says it's verified.
    if (!emailVerified) {
        return { success: false, errors: "Your Google email is not verified, so we can't link it to an account." };
    }

    try {
        // 2. Resolve the account: by Google id, then by email (links existing accounts).
        let user = await getUserByUid(sub);

        if (!user) {
            const existingByEmail = await getUserByEmail(email);

            if (existingByEmail) {
                // Existing account (including email/password students) — attach Google id.
                user = await prisma.user.update({
                    where: { id: existingByEmail.id },
                    data: {
                        uid: sub,
                        image: existingByEmail.image ?? picture,
                        name: existingByEmail.name ?? googleName,
                    },
                });
            } else {
                // No account yet — create a fresh student.
                user = await createNewStudent({
                    name: googleName ?? email.split("@")[0],
                    email,
                    image: picture,
                    uid: sub,
                });
            }
        }

        if (!user) {
            return { success: false, errors: "We couldn't sign you in. Please try again." };
        }

        const name = user.name ?? googleName ?? email.split("@")[0];

        await createUserSession({
            id: user.id,
            name,
            email: user.email,
            phone: user.phone ?? null,
            image: user.image ?? null,
            uid: user.uid ?? null,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
        });

        // Return a sanitized user (no password / token) for client-side storage.
        return {
            success: true,
            errors: null,
            message: "Login was successful",
            user: {
                id: user.id,
                name,
                email: user.email,
                image: user.image ?? null,
                phone: user.phone ?? null,
                uid: user.uid ?? null,
                role: user.role,
                country: user.country ?? null,
                state: user.state ?? null,
                city: user.city ?? null,
                gender: user.gender,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            expiresAt: SESSION_TTL,
        };
    } catch (error) {
        console.log("signInWithGoogle error:", error);
        return { success: false, errors: "Something went wrong during Google sign-in. Please try again." };
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

export async function changePassword(email: string, token: string, newPassword: string) {
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user || user.token !== token) {
        return {
            success: false,
            message: 'Invalid token or email. Please try the password reset process again.',
        }
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
        where: { email },
        data: {
            password: hashedPassword,
            token: null,
        }
    });

    return {
        success: true,
        message: 'Password changed successfully. You can now log in with your new password.',
    }
}