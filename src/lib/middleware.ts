import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getAdminCurrentUser } from './auth';
import { getOne } from './db';
import { User } from '@/types';

export type AuthenticatedHandler = (
    req: NextRequest,
    context: { user: User; params?: Record<string, string> }
) => Promise<NextResponse>;

export type AdminHandler = (
    req: NextRequest,
    context: { user: User; params?: Record<string, string> }
) => Promise<NextResponse>;

// Require authenticated user (regular session cookie)
export function withAuth(handler: AuthenticatedHandler) {
    return async (req: NextRequest, segmentData?: { params?: Promise<Record<string, string>> }) => {
        try {
            const user = await getCurrentUser();
            if (!user) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            const params = segmentData?.params ? await segmentData.params : undefined;
            return handler(req, { user, params });
        } catch {
            return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
    };
}

/**
 * Require admin — uses the ADMIN session cookie (lk_admin_session).
 * This is separate from the regular user session (lk_session).
 * Any route protected by withAdmin must be accessed while holding
 * a valid admin session, regardless of whether a user session exists.
 */
export function withAdmin(handler: AdminHandler) {
    return async (req: NextRequest, segmentData?: { params?: Promise<Record<string, string>> }) => {
        try {
            // Use admin session cookie — NOT the regular user session
            const user = await getAdminCurrentUser();
            if (!user) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            // Check admin_users table — users.role alone is not reliable for admin gating
            const adminRecord = await getOne<{ id: string; admin_role: string; is_active: boolean }>(
                `SELECT id, admin_role, is_active FROM admin_users WHERE user_id = $1`,
                [user.id]
            );
            if (!adminRecord?.is_active) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
            // Inject adminId and admin role into user object for handler use
            const adminUser = { ...user, role: adminRecord.admin_role as User['role'], adminId: adminRecord.id };
            const params = segmentData?.params ? await segmentData.params : undefined;
            return handler(req, { user: adminUser, params });
        } catch {
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
