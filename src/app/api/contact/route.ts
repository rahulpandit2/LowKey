import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/middleware';
import { query } from '@/lib/db';

// POST /api/contact — submit contact form (public, no auth required)
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { first_name, last_name, email, reason, message, consent_emails } = body;

        if (!first_name || !email || !message) {
            return apiError('First name, email, and message are required');
        }

        const validReasons = ['query', 'support', 'feedback', 'report'];

        const safeReason = reason && validReasons.includes(reason) ? reason : 'query';

        // Get IP from headers
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null;

        await query(
            `INSERT INTO contact_submissions (first_name, last_name, email, reason, message, consent_emails, ip_address)
       VALUES ($1, $2, $3, $4::contact_reason, $5, $6, $7::inet)`,
            [
                first_name,
                last_name || null,
                email,
                safeReason,
                message,
                consent_emails ?? false,
                ip,
            ]
        );

        return apiSuccess({ message: 'Your message has been sent. We will get back to you soon.' }, 201);
    } catch (error) {
        console.error('[Contact Error]', error);
        return apiError('Internal server error', 500);
    }
}
