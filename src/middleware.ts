import { NextRequest, NextResponse } from 'next/server';

const rateLimitMap = new Map();

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

    // Basic Rate Limiting
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    const currentPath = req.nextUrl.pathname;

    if (currentPath.startsWith('/api/auth/')) {
        const windowMs = 60 * 1000; // 1 minute
        const maxRequests = 10;

        const key = `${ip}:${currentPath}`;
        const record = rateLimitMap.get(key) || { count: 0, startTime: Date.now() };

        if (Date.now() - record.startTime > windowMs) {
            record.count = 1;
            record.startTime = Date.now();
        } else {
            record.count++;
        }

        rateLimitMap.set(key, record);

        if (record.count > maxRequests) {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }
    }

    return res;
}

// Run on all routes so every layout has access to x-pathname
export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
