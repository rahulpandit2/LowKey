import { query, getOne } from './db';
import { User, Session } from '@/types';
import { cookies } from 'next/headers';
import { randomBytes, createHash } from 'crypto';

const SESSION_COOKIE = 'lk_session';
const SESSION_ADMIN_COOKIE = 'lk_admin_session';
const SESSION_EXPIRY_DAYS = 30;

// Hash password using pgcrypto's crypt (bcrypt)
export async function hashPassword(password: string): Promise<string> {
    const result = await query<{ hash: string }>(
        `SELECT crypt($1, gen_salt('bf', 10)) AS hash`,
        [password]
    );
    return result.rows[0].hash;
}

// Verify password using pgcrypto
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    const result = await query<{ match: boolean }>(
        `SELECT crypt($1, $2) = $2 AS match`,
        [password, hash]
    );
    return result.rows[0].match;
}

// Generate a session token
export function generateSessionToken(): string {
    return randomBytes(32).toString('hex');
}

// Hash session token for storage
export function hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
}

// Create a new session
export async function createSession(
    userId: string,
    ipAddress?: string,
    userAgent?: string
): Promise<string> {
    const token = generateSessionToken();
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    await query(
        `INSERT INTO sessions (user_id, token_hash, ip_address, user_agent, expires_at)
     VALUES ($1, $2, $3, $4, $5)`,
        [userId, tokenHash, ipAddress || null, userAgent || null, expiresAt.toISOString()]
    );

    return token;
}

// Destroy a session
export async function destroySession(token: string): Promise<void> {
    const tokenHash = hashToken(token);
    await query(`DELETE FROM sessions WHERE token_hash = $1`, [tokenHash]);
}

// Get current user from a specific cookie token
async function getUserFromToken(token: string | undefined): Promise<(User & { profile_id: string }) | null> {
    if (!token) return null;

    const tokenHash = hashToken(token);

    const user = await getOne<User & { profile_id: string }>(
        `SELECT u.*, p.id AS profile_id
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     LEFT JOIN profiles p ON p.user_id = u.id
     WHERE s.token_hash = $1
       AND s.expires_at > NOW()
       AND u.status = 'active'
       AND u.deleted_at IS NULL`,
        [tokenHash]
    );

    if (user) {
        // Update last_active
        await query(`UPDATE sessions SET last_active_at = NOW() WHERE token_hash = $1`, [tokenHash]).catch(() => { });
    }

    return user;
}

// Get current user from regular session cookie
export async function getCurrentUser(): Promise<(User & { profile_id: string }) | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    return getUserFromToken(token);
}

// Get current user from admin session cookie
export async function getAdminCurrentUser(): Promise<(User & { profile_id: string }) | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_ADMIN_COOKIE)?.value;
    return getUserFromToken(token);
}

// Set session cookie
export async function setSessionCookie(token: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
    });
}

// Set admin session cookie
export async function setAdminSessionCookie(token: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_ADMIN_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
    });
}

// Clear session cookie
export async function clearSessionCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
}

// Clear admin session cookie
export async function clearAdminSessionCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_ADMIN_COOKIE);
}
