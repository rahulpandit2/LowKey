import { logger } from '@/lib/logger';
import { NextRequest } from 'next/server';
import { apiSuccess, apiError, withAdmin, parseBody } from '@/lib/middleware';
import { getMany } from '@/lib/db';

// GET /api/admin/contact-requests — list all contact submissions
async function handler(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '50', 10);
        const offset = parseInt(searchParams.get('offset') || '0', 10);

        const submissions = await getMany(
            `SELECT id, first_name, last_name, email, contact_reason, message,
                    consent_emails, ip_address, created_at
             FROM contact_submissions
             ORDER BY created_at DESC
             LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        return apiSuccess(submissions);
    } catch (error) {
        logger.error('[Admin Contact Requests Error]', error);
        return apiError('Internal server error', 500);
    }
}

export const GET = withAdmin(handler);
