import { logger } from '@/lib/logger';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { clearAdminSessionCookie, destroySession } from '@/lib/auth';
import { apiError, apiSuccess } from '@/lib/middleware';
import { logAuthEvent } from '@/lib/login-logger';
import { getOne } from '@/lib/db';

export async function POST(req: NextRequest) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || null;
    const ua = req.headers.get('user-agent') || null;

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('lk_admin_session')?.value;

        if (token) {
            const session = await getOne<{ user_id: string }>(
                `SELECT user_id FROM sessions WHERE token_hash = encode(digest($1, 'sha256'), 'hex')`,
                [token]
            );
            const userId = session?.user_id;

            await destroySession(token);
            await clearAdminSessionCookie();

            await logAuthEvent({
                event_type: 'logout', success: true, login_type: 'admin',
                identifier: userId || 'unknown', user_id: userId,
                ip, user_agent: ua
            });
        } else {
            await logAuthEvent({
                event_type: 'logout', success: false, login_type: 'admin',
                identifier: 'unknown', user_id: null,
                ip, user_agent: ua, failure_reason: 'no_session_token'
            });
        }

        return apiSuccess({ message: 'Logged out of admin session successfully' });
    } catch (error) {
        logger.error('[Admin Logout Error]', error);
        return apiError('Internal server error', 500);
    }
}
