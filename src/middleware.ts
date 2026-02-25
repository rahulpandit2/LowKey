import { NextRequest, NextResponse } from 'next/server';

// In-memory rate limit store (resets on cold starts — sufficient for edge environments)
const rateLimitMap = new Map<string, { count: number; startTime: number }>();

/**
 * Middleware — injects the request pathname as a custom header.
 * This allows server-side layouts (like server-admin/layout.tsx) to read
 * the current URL path via headers().get('x-pathname') for routing decisions,
 * e.g. bypassing auth on /server-admin/login to prevent infinite redirect loops.
 *
 * Also applies basic rate limiting to auth endpoints.
 */
export function middleware(req: NextRequest) {
    const res = NextResponse.next();
    res.headers.set('x-pathname', req.nextUrl.pathname);

    // Basic Rate Limiting on auth routes
    const currentPath = req.nextUrl.pathname;

    if (currentPath.startsWith('/api/auth/')) {
        const windowMs = 60 * 1000; // 1 minute
        const maxRequests = 20;

        // req.ip is deprecated in Next.js 15 — use x-forwarded-for header instead
        const ip =
            req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            req.headers.get('x-real-ip') ||
            'unknown';

        const key = `${ip}:${currentPath}`;
        const now = Date.now();
        const record = rateLimitMap.get(key) ?? { count: 0, startTime: now };

        if (now - record.startTime > windowMs) {
            record.count = 1;
            record.startTime = now;
        } else {
            record.count += 1;
        }

        rateLimitMap.set(key, record);

        if (record.count > maxRequests) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }
    }

    return res;
}

// Run on all routes so every layout has access to x-pathname
export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
