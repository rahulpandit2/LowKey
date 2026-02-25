import { query } from '@/lib/db';
import { logger } from '@/lib/logger';

export interface AuthEventData {
    event_type: 'login' | 'logout';
    success: boolean;
    login_type: 'user' | 'admin';
    identifier: string;       // username or email that was tried
    user_id?: string | null;  // resolved user id if found
    ip: string | null;
    user_agent: string | null;
    failure_reason?: string;  // e.g. 'wrong_password', 'user_not_found', 'not_admin'
}

/**
 * Resolve city/country from IP address using ip-api.com (free, no key required, ~45 req/min).
 * Falls back to null on any error (network, rate-limit, private IP).
 */
async function resolveGeo(ip: string | null): Promise<{ city: string; country: string; region: string } | null> {
    if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
        return null; // private / loopback — no geolocation available
    }
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2000); // 2s timeout
        const res = await fetch(
            `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,city,regionName,country`,
            { signal: controller.signal }
        );
        clearTimeout(timeout);
        if (!res.ok) return null;
        const data = await res.json();
        if (data.status !== 'success') return null;
        return { city: data.city || '', country: data.country || '', region: data.regionName || '' };
    } catch {
        return null; // timed out or network error — safe to ignore
    }
}

/**
 * Write an auth event to audit_logs.
 * action = 'login_success' | 'login_failure' | 'logout_success' | 'logout_failure'
 * metadata contains: event_type, login_type, identifier, failure_reason (if any), geo (if resolvable)
 *
 * This function never throws — errors are caught and logged internally.
 */
export async function logAuthEvent(data: AuthEventData): Promise<void> {
    try {
        const geo = await resolveGeo(data.ip);

        const metadata: Record<string, unknown> = {
            event_type: data.event_type,
            login_type: data.login_type,
            identifier: data.identifier,
            success: data.success,
        };
        if (data.failure_reason) metadata.failure_reason = data.failure_reason;
        if (geo) metadata.geo = geo;

        const actionString = data.event_type === 'logout'
            ? (data.success ? 'logout_success' : 'logout_failure')
            : (data.success ? 'login_success' : 'login_failure');

        await query(
            `INSERT INTO audit_logs (user_id, action, ip_address, user_agent, metadata)
             VALUES ($1, $2, $3::inet, $4, $5::jsonb)`,
            [
                data.user_id || null,
                actionString,
                data.ip || null,
                data.user_agent || null,
                JSON.stringify(metadata),
            ]
        );
    } catch (err) {
        // Non-critical: log internally but don't surface to caller
        logger.error('[logAuthEvent]', err);
    }
}
