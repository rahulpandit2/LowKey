import { logger } from '@/lib/logger';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { destroySession, clearSessionCookie } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/middleware';

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('lk_session')?.value;

        if (token) {
            await destroySession(token);
            await clearSessionCookie();
        }

        return apiSuccess({ message: 'Logged out' });
    } catch (error) {
        logger.error('[Logout Error]', error);
        return apiError('Internal server error', 500);
    }
}
