import { describe, it, expect } from 'vitest';
import { apiPost, apiGet, extractSessionCookie, testUser } from '../setup';

describe('Auth API', () => {
    let sessionCookie: string | null = null;
    const user = testUser();

    // ─── Signup ──────────────────────────────────────────────────────────────

    describe('POST /api/auth/signup', () => {
        it('should create a new user with valid data', async () => {
            const res = await apiPost('/api/auth/signup', user);
            expect(res.status).toBe(201);
            sessionCookie = extractSessionCookie(res.headers);
            expect(sessionCookie).toBeTruthy();
        });

        it('should reject signup without username', async () => {
            const res = await apiPost('/api/auth/signup', {
                email: 'no-user@test.com',
                password: 'TestPass123!',
            });
            expect(res.status).toBe(400);
        });

        it('should reject signup without email', async () => {
            const res = await apiPost('/api/auth/signup', {
                username: 'noemail',
                password: 'TestPass123!',
            });
            expect(res.status).toBe(400);
        });

        it('should reject signup without password', async () => {
            const res = await apiPost('/api/auth/signup', {
                username: 'nopass',
                email: 'nopass@test.com',
            });
            expect(res.status).toBe(400);
        });

        it('should reject duplicate username', async () => {
            const res = await apiPost('/api/auth/signup', {
                username: user.username,
                email: 'different@test.com',
                password: 'TestPass123!',
            });
            expect([409, 500]).toContain(res.status);
        });

        it('should reject duplicate email', async () => {
            const res = await apiPost('/api/auth/signup', {
                username: 'differentuser',
                email: user.email,
                password: 'TestPass123!',
            });
            expect([409, 500]).toContain(res.status);
        });
    });

    // ─── Login ───────────────────────────────────────────────────────────────

    describe('POST /api/auth/login', () => {
        it('should login with username and password', async () => {
            const res = await apiPost('/api/auth/login', {
                login: user.username,
                password: user.password,
            });
            expect(res.status).toBe(200);
            sessionCookie = extractSessionCookie(res.headers);
            expect(sessionCookie).toBeTruthy();
        });

        it('should login with email and password', async () => {
            const res = await apiPost('/api/auth/login', {
                login: user.email,
                password: user.password,
            });
            expect(res.status).toBe(200);
        });

        it('should reject wrong password', async () => {
            const res = await apiPost('/api/auth/login', {
                login: user.username,
                password: 'WrongPassword123',
            });
            expect(res.status).toBe(401);
        });

        it('should reject non-existent user', async () => {
            const res = await apiPost('/api/auth/login', {
                login: 'nonexistent_user_xyz',
                password: 'Whatever123',
            });
            expect(res.status).toBe(401);
        });

        it('should reject empty body', async () => {
            const res = await apiPost('/api/auth/login', {});
            expect(res.status).toBe(400);
        });
    });

    // ─── Session ─────────────────────────────────────────────────────────────

    describe('GET /api/auth/me', () => {
        it('should return user for valid session', async () => {
            expect(sessionCookie).toBeTruthy();
            const res = await apiGet('/api/auth/me', sessionCookie!);
            expect(res.status).toBe(200);
            const data = res.data as { data: { user: { username: string } } };
            expect(data.data.user.username).toBe(user.username);
        });

        it('should return 401 without cookie', async () => {
            const res = await apiGet('/api/auth/me');
            expect(res.status).toBe(401);
        });

        it('should return 401 for invalid cookie', async () => {
            const res = await apiGet('/api/auth/me', 'lk_session=invalid_token_xyz');
            expect(res.status).toBe(401);
        });
    });

    // ─── Logout ──────────────────────────────────────────────────────────────

    describe('POST /api/auth/logout', () => {
        it('should clear session', async () => {
            expect(sessionCookie).toBeTruthy();
            const res = await apiPost('/api/auth/logout', {}, sessionCookie!);
            expect(res.status).toBe(200);
        });

        it('should fail to get user after logout', async () => {
            const res = await apiGet('/api/auth/me', sessionCookie!);
            expect(res.status).toBe(401);
        });
    });
});
