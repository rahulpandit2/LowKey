import { query } from './db';

type LogLevel = 'info' | 'warn' | 'error';

export const logger = {
    info: async (action: string, metadata: any = {}) => {
        await logToDb('info', action, metadata);
    },
    warn: async (action: string, metadata: any = {}) => {
        await logToDb('warn', action, metadata);
    },
    error: async (action: string, metadata: any = {}) => {
        await logToDb('error', action, metadata);
    }
};

async function logToDb(level: LogLevel, action: string, metadata: any) {
    try {
        await query(
            `INSERT INTO audit_logs (action, metadata) VALUES ($1, $2)`,
            [action, JSON.stringify({ level, ...metadata })]
        );
    } catch (e) {
        // Fallback to console if DB fails so we don't silently swallow errors
        console.error('Failed to write to audit_logs:', e);
    }
}
