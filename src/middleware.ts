import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware — injects the request pathname as a custom header.
 * This lets server-side layouts (like server-admin/layout.tsx) read
 * the current URL path via `headers().get('x-pathname')` to make
 * routing decisions — for example, bypassing auth on /server-admin/login
 * to prevent infinite redirect loops.
 */
export function middleware(req: NextRequest) {
    const res = NextResponse.next();
    res.headers.set('x-pathname', req.nextUrl.pathname);
    return res;
}

// Run on all routes so every layout has access to x-pathname
export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
