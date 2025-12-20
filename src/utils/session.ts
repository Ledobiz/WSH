import * as z from 'zod'
import crypto from "crypto";
import { redisClient } from '../lib/redis';

// Seven days in seconds
const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7;
const SESSION_EXPIRATION_MS = 1000 * 60 * 60 * 24 * 7;
const ONE_DAY_MS = 1000 * 60 * 60 * 24;
const SESSION_TTL = new Date(Date.now() + SESSION_EXPIRATION_MS);
const COOKIE_SESSION_KEY = process.env.SESSION_NAME!;

const userRoles = ["admin", "student"]

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

export type Cookies = {
    set: (
        key: string,
        value: string,
        options: {
            secure?: boolean
            httpOnly?: boolean
            sameSite?: "strict" | "lax"
            expires?: number,
            path: string,
        }
    ) => void
    get: (key: string) => { name: string; value: string } | undefined
    delete: (key: string) => void
}

export async function getUserFromSession(cookies: Pick<Cookies, "get">) {
    const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
    if (sessionId == null) return null;

    return getUserSessionById(sessionId);
}

export async function createUserSession(user: UserSession, cookies: Cookies) {
    const sessionId = crypto.randomBytes(512).toString("hex").normalize()

    const sessionData = {
        ...user,
        ttlUntil: SESSION_TTL,
    };

    await redisClient.set(`session:${sessionId}`, sessionSchema.parse(sessionData), {
        ex: SESSION_EXPIRATION_SECONDS
    })

    setCookie(sessionId, cookies)
}

async function getUserSessionById(sessionId: string) {
    const rawUser = await redisClient.get(`session:${sessionId}`);

    const { success, data: user } = sessionSchema.safeParse(rawUser);

    return success ? user : null;
}

export async function removeUserFromSession(cookies: Pick<Cookies, "get" | "delete">) {
    const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
    if (sessionId == null) return null;

    await redisClient.del(`session:${sessionId}`);
    cookies.delete(COOKIE_SESSION_KEY);
}

export async function updateUserSessionExpiration(cookies: Pick<Cookies, "get" | "set">) {
    const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
    if (sessionId == null) return null;

    const user = await getUserSessionById(sessionId);
    if (user == null) return;

    const now = new Date();

    const msRemaining = user.ttlUntil ? user.ttlUntil?.getTime() - now.getTime() : 0;

    // If ttlUntil is already passed -> do not extend
    if (msRemaining <= 0) {
        await redisClient.del(`session:${sessionId}`);
        return null;
    }

    // If remaining time is more than 1 day -> do not extend yet
    if (msRemaining > ONE_DAY_MS) {
        return null;
    }

    // Remaining time is <= 1 day and > 0 -> we can extend the session.
    const newSession = {
        ...user,
        ttlUntil: SESSION_TTL,
    };
    await redisClient.set(`session:${sessionId}`, newSession, {
        ex: SESSION_EXPIRATION_SECONDS,
    });
    setCookie(sessionId, cookies);
}

export async function updateUserSessionData(user: UserSession, cookies: Pick<Cookies, "get">) {
    const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
    if (sessionId == null) return null;

    await redisClient.set(`session:${sessionId}`, sessionSchema.parse(user), {
        ex: SESSION_EXPIRATION_SECONDS,
    });
}

export function setCookie(sessionId: string, cookies: Pick<Cookies, "set">) {
    cookies.set(COOKIE_SESSION_KEY, sessionId, {
        secure: true,
        httpOnly: true,
        sameSite: "lax",
        expires: Date.now() + SESSION_EXPIRATION_SECONDS * 1000,
        path: "/"
    })
}