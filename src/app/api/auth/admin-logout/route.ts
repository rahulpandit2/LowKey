import { logger } from '@/lib/logger';
import { NextRequest } from 'next/server';
import { clearAdminSessionCookie } from '@/lib/auth';
import { apiError, apiSuccess } from '@/lib/middleware';

export async function POST(req: NextRequest) {
    try {
        await clearAdminSessionCookie();
        return apiSuccess({ message: 'Logged out of admin session successfully' });
    } catch (error) {
        logger.error('[Admin Logout Error]', error);
        return apiError('Internal server error', 500);
    }
}
