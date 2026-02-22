import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/middleware';
import { getMany } from '@/lib/db';

// GET /api/policies — returns latest published policies
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const docType = searchParams.get('type'); // optional filter

        let sql = `
            SELECT DISTINCT ON (doc_type)
                id, doc_type, title, content as body, version as version_number, status, published_at, created_at
            FROM policy_versions
            WHERE status = 'published'
        `;
        const params: string[] = [];

        if (docType) {
            sql += ` AND doc_type = $1`;
            params.push(docType);
        }

        sql += ` ORDER BY doc_type, published_at DESC NULLS LAST, version DESC`;

        const policies = await getMany(sql, params);
        return apiSuccess(policies);
    } catch (error) {
        console.error('[Policies Error]', error);
        return apiError('Internal server error', 500);
    }
}
