import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getUserFromSession, updateUserSessionExpiration } from './utils/jwt'
import { adminDashboardUrl, loginUrl, studentDashboardUrl } from './utils/url'

const privateRoutes = ["/learners"]
const adminRoutes = ["/admin"]
const authRoutes = ['/sign-up', '/sign-in'];

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Early return if route doesn't need authentication
    const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

    if (!isPrivateRoute && !isAdminRoute) {
        if (isAuthRoute) {
            const user = await getUserFromSession();

            if (user == null) {
                return NextResponse.next();
            }
            else {
                if (user.role == 'admin') {
                    return NextResponse.redirect(new URL(adminDashboardUrl, request.url));
                }
                else {
                    return NextResponse.redirect(new URL(studentDashboardUrl, request.url));
                }
            }
        }
        else {
            return NextResponse.next();
        }
    }

    const response = (await middlewareAuth(request)) ?? NextResponse.next();

    return response
}

async function middlewareAuth(request: NextRequest) {
    const sessionName = process.env.SESSION_NAME!;

    const token = request.cookies.get(sessionName)?.value;

    if (!token) {
        return NextResponse.redirect(new URL(loginUrl, request.url));
    }

    if (privateRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
        const user = await getUserFromSession();

        if (user == null) {
            return NextResponse.redirect(new URL(loginUrl, request.url))
        }
        else {
            updateUserSessionExpiration();
        }
    }

    if (adminRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
        const user = await getUserFromSession();

        if (user == null) {
            return NextResponse.redirect(new URL(loginUrl, request.url))
        }
        else {
            updateUserSessionExpiration();
        }

        if (user.role !== "admin") {
            return NextResponse.redirect(new URL(studentDashboardUrl, request.url))
        }
    }
}

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        // "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

        // Only run middleware on private and admin routes
        "/learners/:path*",
        "/admin/:path*",
        "/sign-in",
        "/sign-up",
    ],
}