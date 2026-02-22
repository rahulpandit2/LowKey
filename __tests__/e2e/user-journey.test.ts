import { describe, it, expect, beforeAll } from 'vitest';
import { apiPost, apiGet, extractSessionCookie, testUser } from '../setup';

describe('E2E: Full User Journey', () => {
    const user = testUser();
    let cookie: string | null = null;
    let postId: string;

    it('Step 1: Sign up', async () => {
        const res = await apiPost('/api/auth/signup', user);
        expect(res.status).toBe(201);
        cookie = extractSessionCookie(res.headers);
        expect(cookie).toBeTruthy();
    });

    it('Step 2: View profile (me)', async () => {
        const res = await apiGet('/api/auth/me', cookie!);
        expect(res.status).toBe(200);
    });

    it('Step 3: Create a post', async () => {
        const res = await apiPost('/api/posts', {
            body: 'E2E test post: sharing my first thought.',
            post_type: 'thought',
        }, cookie!);
        expect(res.status).toBe(201);
        const data = res.data as { data: { id: string } };
        postId = data.data.id;
    });

    it('Step 4: View the post', async () => {
        const res = await apiGet(`/api/posts/${postId}`, cookie!);
        expect(res.status).toBe(200);
    });

    it('Step 5: View feed', async () => {
        const res = await apiGet('/api/feed', cookie!);
        expect(res.status).toBe(200);
    });

    it('Step 6: View notifications', async () => {
        const res = await apiGet('/api/notifications', cookie!);
        expect(res.status).toBe(200);
    });

    it('Step 7: View messages', async () => {
        const res = await apiGet('/api/messages', cookie!);
        expect(res.status).toBe(200);
    });

    it('Step 8: View achievements', async () => {
        const res = await apiGet('/api/achievements', cookie!);
        expect(res.status).toBe(200);
    });

    it('Step 9: Search', async () => {
        const res = await apiGet(`/api/search?q=${user.username}`, cookie!);
        expect(res.status).toBe(200);
    });

    it('Step 10: Logout', async () => {
        const res = await apiPost('/api/auth/logout', {}, cookie!);
        expect(res.status).toBe(200);
    });

    it('Step 11: Verify logged out', async () => {
        const res = await apiGet('/api/auth/me', cookie!);
        expect(res.status).toBe(401);
    });
});

describe('E2E: Contact Form (no auth)', () => {
    it('should submit contact form without authentication', async () => {
        const res = await apiPost('/api/contact', {
            first_name: 'Jane',
            last_name: 'Doe',
            email: 'jane@example.com',
            contact_reason: 'query',
            message: 'E2E: Is this platform open to everyone?',
        });
        expect(res.status).toBe(201);
    });
});
