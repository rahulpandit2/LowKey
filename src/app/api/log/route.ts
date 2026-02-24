import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { level, action, metadata } = body;

        if (level === 'info') logger.info(action, metadata);
        else if (level === 'warn') logger.warn(action, metadata);
        else if (level === 'error') logger.error(action, metadata);

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ success: false }, { status: 400 });
    }
}
