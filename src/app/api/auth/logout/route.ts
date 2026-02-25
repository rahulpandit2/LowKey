import { logger } from '@/lib/logger';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { destroySession, clearSessionCookie } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/middleware';
import { logAuthEvent } from '@/lib/login-logger';
import { getOne } from '@/lib/db';

export async function POST(req: NextRequest) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || null;
    const ua = req.headers.get('user-agent') || null;

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('lk_session')?.value;

        if (token) {
            // Find session to get user_id before destroying
            const session = await getOne<{ user_id: string }>(
                `SELECT user_id FROM sessions WHERE token_hash = encode(digest($1, 'sha256'), 'hex')`,
                [token]
            );
            const userId = session?.user_id;

            await destroySession(token);
            await clearSessionCookie();

            await logAuthEvent({
                event_type: 'logout', success: true, login_type: 'user',
                identifier: userId || 'unknown', user_id: userId,
                ip, user_agent: ua
            });
        } else {
            await logAuthEvent({
                event_type: 'logout', success: false, login_type: 'user',
                identifier: 'unknown', user_id: null,
                ip, user_agent: ua, failure_reason: 'no_session_token'
            });
        }

        return apiSuccess({ message: 'Logged out' });
    } catch (error) {
        logger.error('[Logout Error]', error);
        return apiError('Internal server error', 500);
    }
}
