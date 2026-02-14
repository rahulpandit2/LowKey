import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from './auth';
import { User } from '@/types';

export type AuthenticatedHandler = (
    req: NextRequest,
    context: { user: User; params?: Record<string, string> }
) => Promise<NextResponse>;

export type AdminHandler = (
    req: NextRequest,
    context: { user: User; params?: Record<string, string> }
) => Promise<NextResponse>;

// Require authenticated user
export function withAuth(handler: AuthenticatedHandler) {
    return async (req: NextRequest, segmentData?: { params?: Promise<Record<string, string>> }) => {
        try {
            const user = await getCurrentUser();
            if (!user) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            const params = segmentData?.params ? await segmentData.params : undefined;
            return handler(req, { user, params });
        } catch (error) {
            console.error('[Auth Middleware]', error);
            return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
    };
}

// Require admin role
export function withAdmin(handler: AdminHandler) {
    return async (req: NextRequest, segmentData?: { params?: Promise<Record<string, string>> }) => {
        try {
            const user = await getCurrentUser();
            if (!user) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            if (user.role !== 'admin' && user.role !== 'super_admin') {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
            const params = segmentData?.params ? await segmentData.params : undefined;
            return handler(req, { user, params });
        } catch (error) {
            console.error('[Admin Middleware]', error);
            return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
    };
}

// Standard error response
export function apiError(message: string, status: number = 400) {
    return NextResponse.json({ error: message }, { status });
}

// Standard success response
export function apiSuccess<T>(data: T, status: number = 200) {
    return NextResponse.json({ data }, { status });
}

// Parse JSON body safely
export async function parseBody<T>(req: NextRequest): Promise<T | null> {
    try {
        return await req.json() as T;
    } catch {
        return null;
    }
}
