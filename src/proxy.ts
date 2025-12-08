import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { getUserFromSession, sessionSchema } from './utils/session'
import { loginUrl, studentDashboardUrl } from './utils/url'
import { redisClient } from './lib/redis'

const privateRoutes = ["/learners"]
const adminRoutes = ["/admin"]

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Early return if route doesn't need authentication
    const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

    if (!isPrivateRoute && !isAdminRoute) {
        return NextResponse.next();
    }

    const response = (await middlewareAuth(request)) ?? NextResponse.next();

    return response
}

async function middlewareAuth(request: NextRequest) {
    const sessionName = process.env.SESSION_NAME!;

    const sessionId = request.cookies.get(sessionName)?.value;

    if (privateRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
        const user = await getUserFromSession(request.cookies)

        if (user == null) {
            return NextResponse.redirect(new URL(loginUrl, request.url))
        }
        else {
            refreshSessionIfAlmostExpired(user, sessionId);
        }
    }

    if (adminRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
        const user = await getUserFromSession(request.cookies)
        if (user == null) {
            return NextResponse.redirect(new URL(loginUrl, request.url))
        }
        else {
            refreshSessionIfAlmostExpired(user, sessionId);
        }

        if (user.role !== "admin") {
            return NextResponse.redirect(new URL(studentDashboardUrl, request.url))
        }
    }
}

async function refreshSessionIfAlmostExpired(user: any, sessionId: string | undefined | null) {
    if (!sessionId || !user) {
        return;
    }

    const now = new Date();

    const msRemaining = user?.ttlUntil ? user?.ttlUntil?.getTime() - now.getTime() : 0;

    // If ttlUntil is already passed -> do not extend
    if (msRemaining <= 0) {
        return;
    }

    // If remaining time is more than 1 day -> do not extend yet
    if (msRemaining > (1000 * 60 * 60 * 24)) {
        return;
    }

    // Remaining time is <= 1 day and > 0 -> we can extend the session.
    const newTtl = 1000 * 60 * 60 * 24 * 7;
    const sessionTtlInSecs = 60 * 60 * 24 * 7;

    const newSession = {
        ...user,
        ttlUntil: new Date(Date.now() + newTtl),
    };

    await redisClient.set(`session:${sessionId}`, sessionSchema.parse(newSession), {
        ex: sessionTtlInSecs
    });

    const cookieStore = await cookies();
    cookieStore.set({
        name: process.env.SESSION_NAME!,
        value: sessionId,
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        expires: Date.now() + newTtl,
    });
}

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        // "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

        // Only run middleware on private and admin routes
        "/learners/:path*",
        "/admin/:path*",
    ],
}