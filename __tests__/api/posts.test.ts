import { describe, it, expect, beforeAll } from 'vitest';
import { apiPost, apiGet, apiPut, apiDelete, extractSessionCookie, testUser } from '../setup';

describe('Posts API', () => {
    let sessionCookie: string | null = null;
    let postId: string;
    const user = testUser();

    beforeAll(async () => {
        // Create user and login
        const signup = await apiPost('/api/auth/signup', user);
        sessionCookie = extractSessionCookie(signup.headers);
    });

    // ─── Create ──────────────────────────────────────────────────────────────

    describe('POST /api/posts', () => {
        it('should create a thought post', async () => {
            const res = await apiPost('/api/posts', {
                body: 'This is a test thought post from Vitest',
                post_type: 'thought',
            }, sessionCookie!);
            expect(res.status).toBe(201);
            const data = res.data as { data: { id: string } };
            postId = data.data.id;
            expect(postId).toBeTruthy();
        });

        it('should create a help post', async () => {
            const res = await apiPost('/api/posts', {
                body: 'I need help with testing from Vitest',
                post_type: 'help',
            }, sessionCookie!);
            expect(res.status).toBe(201);
        });

        it('should create an incognito post', async () => {
            const res = await apiPost('/api/posts', {
                body: 'This is anonymous from Vitest',
                post_type: 'thought',
                is_incognito: true,
            }, sessionCookie!);
            expect(res.status).toBe(201);
        });

        it('should reject post without body', async () => {
            const res = await apiPost('/api/posts', {
                post_type: 'thought',
            }, sessionCookie!);
            expect(res.status).toBe(400);
        });

        it('should reject post without auth', async () => {
            const res = await apiPost('/api/posts', {
                body: 'Unauthorized post',
                post_type: 'thought',
            });
            expect(res.status).toBe(401);
        });
    });

    // ─── Read ────────────────────────────────────────────────────────────────

    describe('GET /api/posts/[id]', () => {
        it('should return own post with is_own_post=true', async () => {
            const res = await apiGet(`/api/posts/${postId}`, sessionCookie!);
            expect(res.status).toBe(200);
            const data = res.data as { data: { is_own_post: boolean } };
            expect(data.data.is_own_post).toBe(true);
        });

        it('should return 404 for non-existent post', async () => {
            const res = await apiGet('/api/posts/00000000-0000-0000-0000-000000000000', sessionCookie!);
            expect(res.status).toBe(404);
        });
    });

    // ─── Update ──────────────────────────────────────────────────────────────

    describe('PUT /api/posts/[id]', () => {
        it('should update own post body', async () => {
            const res = await apiPut(`/api/posts/${postId}`, {
                body: 'Updated content from Vitest',
            }, sessionCookie!);
            expect(res.status).toBe(200);
        });
    });

    // ─── Delete ──────────────────────────────────────────────────────────────

    describe('DELETE /api/posts/[id]', () => {
        it('should soft-delete own post', async () => {
            const res = await apiDelete(`/api/posts/${postId}`, sessionCookie!);
            expect(res.status).toBe(200);
        });

        it('should return 404 for deleted post', async () => {
            const res = await apiGet(`/api/posts/${postId}`, sessionCookie!);
            expect(res.status).toBe(404);
        });
    });
});
