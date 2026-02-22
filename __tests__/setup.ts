/**
 * Test setup & helpers for LowKey API tests.
 *
 * These tests hit the RUNNING dev server (localhost:3000).
 * Ensure `npm run dev` is active before running tests.
 */

export const BASE_URL = process.env.TEST_BASE_URL || 'http://127.0.0.1:4030';

// ─── Request helpers ────────────────────────────────────────────────────────

export async function api(
    path: string,
    options: RequestInit & { cookie?: string } = {}
) {
    const { cookie, ...fetchOptions } = options;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };
    if (cookie) {
        headers['Cookie'] = cookie;
    }
    const res = await fetch(`${BASE_URL}${path}`, {
        ...fetchOptions,
        headers,
        redirect: 'manual', // Don't follow redirects so we can test auth guards
    });
    const text = await res.text();
    let data: unknown = null;
    try {
        data = JSON.parse(text);
    } catch {
        data = text;
    }
    return { status: res.status, data, headers: res.headers };
}

export async function apiPost(path: string, body: unknown, cookie?: string) {
    return api(path, {
        method: 'POST',
        body: JSON.stringify(body),
        cookie,
    });
}

export async function apiGet(path: string, cookie?: string) {
    return api(path, { method: 'GET', cookie });
}

export async function apiPut(path: string, body: unknown, cookie?: string) {
    return api(path, {
        method: 'PUT',
        body: JSON.stringify(body),
        cookie,
    });
}

export async function apiDelete(path: string, cookie?: string) {
    return api(path, { method: 'DELETE', cookie });
}

// ─── Cookie extraction helper ───────────────────────────────────────────────

export function extractSessionCookie(headers: Headers): string | null {
    // Try getSetCookie() first (Node 20+, proper multi-cookie handling)
    try {
        const cookies = (headers as any).getSetCookie?.();
        if (cookies && Array.isArray(cookies)) {
            for (const c of cookies) {
                const match = c.match(/lk_session=([^;]+)/);
                if (match) return `lk_session=${match[1]}`;
            }
        }
    } catch { /* fallback below */ }

    // Fallback to headers.get (may concatenate multiple Set-Cookie headers)
    const setCookie = headers.get('set-cookie');
    if (!setCookie) return null;
    const match = setCookie.match(/lk_session=([^;]+)/);
    return match ? `lk_session=${match[1]}` : null;
}

// ─── Unique value helpers ───────────────────────────────────────────────────

let counter = 0;
export function uniqueId(): string {
    return `test_${Date.now()}_${++counter}`;
}

export function testUser() {
    const id = uniqueId();
    return {
        username: `user_${id}`,
        email: `${id}@test.lowkey.app`,
        password: 'TestPass123!',
    };
}
