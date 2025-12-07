import * as z from 'zod'
import crypto from "crypto";
import bcrypt from "bcrypt";
import { redisClient } from '../lib/redis';

// Seven days in seconds
const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7
const COOKIE_SESSION_KEY = "wsh-session"

const userRoles = ["admin", "student"]

const sessionSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    phone: z.string().nullable().optional(),
    image: z.string().nullable().optional(),
    uid: z.string().nullable().optional(),
    role: z.enum(userRoles),
    isActive: z.boolean().default(true),
    createdAt: z.date()
})

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

export async function createUserSession(user: UserSession, cookies: Cookies)
{
    const sessionId = crypto.randomBytes(512).toString("hex").normalize()
    await redisClient.set(`session:${sessionId}`, sessionSchema.parse(user), {
        ex: SESSION_EXPIRATION_SECONDS
    })

    setCookie(sessionId, cookies)
}

function setCookie(sessionId: string, cookies: Pick<Cookies, "set">)
{
    cookies.set(COOKIE_SESSION_KEY, sessionId, {
        secure: true,
        httpOnly: true,
        sameSite: "lax",
        expires: Date.now() + SESSION_EXPIRATION_SECONDS * 1000,
        path: "/"
    })
}

export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 12; // Good default
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> 
{
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
}