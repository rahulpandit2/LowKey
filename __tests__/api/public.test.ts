import { describe, it, expect } from 'vitest';
import { apiPost, apiGet } from '../setup';

describe('Contact API', () => {
    describe('POST /api/contact', () => {
        it('should accept valid submission without auth', async () => {
            const res = await apiPost('/api/contact', {
                first_name: 'Test',
                last_name: 'User',
                email: 'testcontact@example.com',
                contact_reason: 'feedback',
                message: 'This is a test feedback submission from Vitest.',
                consent_emails: true,
            });
            expect(res.status).toBe(201);
        });

        it('should reject missing first_name', async () => {
            const res = await apiPost('/api/contact', {
                email: 'noname@test.com',
                contact_reason: 'query',
                message: 'Missing name',
            });
            expect(res.status).toBe(400);
        });

        it('should reject missing email', async () => {
            const res = await apiPost('/api/contact', {
                first_name: 'Test',
                contact_reason: 'query',
                message: 'Missing email',
            });
            expect(res.status).toBe(400);
        });

        it('should reject missing message', async () => {
            const res = await apiPost('/api/contact', {
                first_name: 'Test',
                email: 'test@test.com',
                contact_reason: 'query',
            });
            expect(res.status).toBe(400);
        });
    });
});

describe('Policies API', () => {
    describe('GET /api/policies', () => {
        it('should return published policies', async () => {
            const res = await apiGet('/api/policies');
            expect(res.status).toBe(200);
            const data = res.data as { data: unknown[] };
            expect(Array.isArray(data.data)).toBe(true);
        });

        it('should filter by type', async () => {
            const res = await apiGet('/api/policies?type=privacy_policy');
            expect(res.status).toBe(200);
        });
    });
});

describe('Search API', () => {
    describe('GET /api/search', () => {
        it('should require auth', async () => {
            const res = await apiGet('/api/search?q=test');
            expect(res.status).toBe(401);
        });
    });
});
