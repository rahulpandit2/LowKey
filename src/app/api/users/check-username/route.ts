import { NextRequest } from 'next/server';
import { getOne } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/middleware';

// GET /api/users/check-username?username=xxx — check if username is available (public endpoint)
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const username = searchParams.get('username');

        if (!username) {
            return apiError('Username required', 400);
        }

        if (username.length < 3 || username.length > 50) {
            return apiError('Username must be between 3 and 50 characters', 400);
        }

        // Check if username exists
        const existing = await getOne(
            `SELECT id FROM users WHERE username = $1`,
            [username.toLowerCase()]
        );

        return apiSuccess({
            username: username.toLowerCase(),
            available: !existing,
        });
    } catch (error) {
        console.error('[Check Username Error]', error);
        return apiError('Internal server error', 500);
    }
}
