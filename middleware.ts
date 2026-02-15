import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth";

export async function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get("session")?.value;

    // 1. Decrypt session
    let session = null;
    if (sessionCookie) {
        try {
            session = await decrypt(sessionCookie);
        } catch (e) {
            // Invalid token
            session = null;
        }
    }

    const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
    const isAuthPage = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register");

    // 2. Protect Dashboard Routes
    if (isDashboard && !session) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // 3. Redirect if already logged in
    if (isAuthPage && session) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // 4. Role Based Access
    // Restrict Management routes to ADMIN only
    const isManagementRoute =
        request.nextUrl.pathname.startsWith("/dashboard/services") ||
        request.nextUrl.pathname.startsWith("/dashboard/staff") ||
        request.nextUrl.pathname.startsWith("/dashboard/settings");

    if (isManagementRoute && session?.role !== "ADMIN") {
        // Redirect unauthorized access to main dashboard
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public images/assets
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
