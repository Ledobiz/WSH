/* eslint-disable @typescript-eslint/no-explicit-any */

import { SignJWT, jwtVerify } from "jose";
import * as z from 'zod';
import { cookies } from "next/headers";

const userRoles = ["admin", "student"];

export const sessionSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    phone: z.string().nullable().optional(),
    image: z.string().nullable().optional(),
    uid: z.string().nullable().optional(),
    role: z.enum(userRoles),
    isActive: z.boolean().default(true),
    createdAt: z.coerce.date(),
    ttlUntil: z.coerce.date().nullable().optional(),
});

type UserSession = z.infer<typeof sessionSchema>

// Session tokens are signed with a SERVER-ONLY secret. Never use a NEXT_PUBLIC_*
// variable here: those are bundled into browser JavaScript, which would let anyone
// forge a session (including role "admin"). Fails closed if the secret is missing.
const MIN_SECRET_LENGTH = 32;
let secretKey: Uint8Array | null = null;
function getSecretKey(): Uint8Array {
    if (secretKey) return secretKey;
    const secret = process.env.SESSION_SECRET;
    if (!secret || secret.length < MIN_SECRET_LENGTH) {
        throw new Error(`SESSION_SECRET must be set to a random value of at least ${MIN_SECRET_LENGTH} characters`);
    }
    if (secret === process.env.NEXT_PUBLIC_APP_KEY) {
        throw new Error("SESSION_SECRET must not reuse NEXT_PUBLIC_APP_KEY (that value is public)");
    }
    secretKey = new TextEncoder().encode(secret);
    return secretKey;
}
const SESSION_NAME = process.env.SESSION_NAME!;
const SESSION_EXPIRATION_MS = 1000 * 60 * 60 * 24 * 3;
const ONE_DAY_MS = 1000 * 60 * 60 * 24;
export const SESSION_TTL = new Date(Date.now() + SESSION_EXPIRATION_MS);

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d") // Token expires in 7 days
        .sign(getSecretKey());
}

export async function decrypt(token: string) {
    let key: Uint8Array;
    try {
        key = getSecretKey();
    } catch (error) {
        // Misconfiguration: treat everyone as logged out (public pages and checkout keep
        // working, nobody is authenticated) and make it loud in the logs.
        console.error("[auth] Session verification disabled:", (error as Error).message);
        return null;
    }
    try {
        const { payload } = await jwtVerify(token, key, {
            algorithms: ["HS256"],
        });
        return payload;
    } catch (error) {
        return null;
    }
}

export async function createUserSession(user: UserSession) {
    const expiresAt = SESSION_TTL;
    const session = await encrypt({
        ...user,
        expiresAt,
        ttlUntil: expiresAt
    });

    // 3. Set the cookie
    (await cookies()).set(SESSION_NAME, session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: "lax",
        path: "/",
    });
}

export async function removeUserFromSession() {
    const token = (await cookies()).get(SESSION_NAME)?.value;
    if (token == null) return null;

    (await cookies()).delete(SESSION_NAME);
}

export async function updateUserSessionExpiration() {
    const token = (await cookies()).get(SESSION_NAME)?.value;
    if (token == null) return null;

    const user = await decrypt(token);
    if (!user) return;

    const now = new Date();
    const ttlUntil = user.ttlUntil as number | string | Date | undefined;
    const msRemaining = ttlUntil ? new Date(ttlUntil).getTime() - now.getTime() : 0;

    // If ttlUntil is already passed -> do not extend
    if (msRemaining <= 0) {
        (await cookies()).delete(SESSION_NAME);
        return null;
    }

    // If remaining time is more than 1 day -> do not extend yet
    if (msRemaining > ONE_DAY_MS) {
        return null;
    }

    // Remaining time is <= 1 day and > 0 -> we can extend the session.
    const newSession = await encrypt({
        ...user,
        expiresAt: SESSION_TTL,
        ttlUntil: SESSION_TTL,
    });

    (await cookies()).set(SESSION_NAME, newSession, {
        httpOnly: true,
        secure: true,
        expires: SESSION_TTL,
        sameSite: "lax",
        path: "/",
    });
}

export async function getUserFromSession() {
    const token = (await cookies()).get(SESSION_NAME)?.value;
    if (token == null) return null;

    const rawUser = await decrypt(token);
    if (!rawUser) return null;

    const { success, data: user } = sessionSchema.safeParse(rawUser);

    return success ? user : null;
}