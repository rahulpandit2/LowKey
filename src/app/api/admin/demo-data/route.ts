import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { apiError, apiSuccess } from '@/lib/middleware';
import { insertDemoData } from '@/db/demo-insert';
import { purgeDemoData } from '@/db/demo-purge';

export async function POST(req: NextRequest) {
    try {
        const admin = await requireAdmin();
        if (!admin) return apiError('Unauthorized', 401);

        await insertDemoData();

        return apiSuccess({ message: 'Demo data inserted successfully' });
    } catch (error) {
        console.error('[Demo Insert Error]', error);
        return apiError('Internal server error', 500);
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const admin = await requireAdmin();
        if (!admin) return apiError('Unauthorized', 401);

        await purgeDemoData();

        return apiSuccess({ message: 'Demo data purged successfully' });
    } catch (error) {
        console.error('[Demo Purge Error]', error);
        return apiError('Internal server error', 500);
    }
}
