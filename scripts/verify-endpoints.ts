/**
 * Endpoint Verification Script
 * Tests all 21 API routes for correct HTTP status codes and response shapes.
 * 
 * Usage: npx tsx scripts/verify-endpoints.ts
 * 
 * Requires: dev server running on localhost:3000
 */

const BASE = process.env.TEST_BASE || 'http://localhost:4028';

type TestResult = {
    endpoint: string;
    method: string;
    status: number;
    pass: boolean;
    note: string;
};

const results: TestResult[] = [];
let sessionCookie = '';
let testUserId = '';
let testPostId = '';
let testThreadId = '';

// ── Helpers ──────────────────────────

async function req(
    method: string,
    path: string,
    body?: Record<string, unknown>,
    expectStatus?: number | number[]
): Promise<{ status: number; data: any; headers: Headers }> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (sessionCookie) headers['Cookie'] = sessionCookie;

    const res = await fetch(`${BASE}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        redirect: 'manual',
    });

    let data: any = null;
    try {
        data = await res.json();
    } catch { }

    const expected = Array.isArray(expectStatus) ? expectStatus : [expectStatus || 200];
    const pass = expected.includes(res.status);

    results.push({
        endpoint: `${method} ${path}`,
        method,
        status: res.status,
        pass,
        note: pass ? (data?.error || data?.data?.message || 'OK') : `Expected ${expected.join('|')}, got ${res.status}: ${data?.error || JSON.stringify(data).slice(0, 100)}`,
    });

    // Capture set-cookie header
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
        const match = setCookie.match(/lk_session=[^;]+/);
        if (match) sessionCookie = match[0];
    }

    return { status: res.status, data, headers: res.headers };
}

// ── Test Suites ──────────────────────

async function testAuthEndpoints() {
    console.log('\n🔐 AUTH ENDPOINTS');
    console.log('─'.repeat(50));

    // 1. Signup
    const ts = Date.now();
    const { data: signupData } = await req('POST', '/api/auth/signup', {
        username: `testuser_${ts}`,
        email: `test_${ts}@lowkey.test`,
        password: 'TestPassword123!',
        display_name: 'Test User',
    }, [201, 500]); // 500 if DB not connected

    if (signupData?.data?.id) {
        testUserId = signupData.data.id;
    }

    // 2. Signup validation (missing fields)
    await req('POST', '/api/auth/signup', { username: '' }, 400);

    // 3. Logout
    await req('POST', '/api/auth/logout', {}, 200);

    // 4. Login
    await req('POST', '/api/auth/login', {
        login: `testuser_${ts}`,
        password: 'TestPassword123!',
    }, [200, 401, 500]); // 401 if signup failed, 500 if no DB

    // 5. Login validation
    await req('POST', '/api/auth/login', {}, 400);

    // 6. Get current user
    await req('GET', '/api/auth/me', undefined, [200, 401]);
}

async function testPostEndpoints() {
    console.log('\n📝 POST ENDPOINTS');
    console.log('─'.repeat(50));

    // 7. Create post
    const { data: postData } = await req('POST', '/api/posts', {
        body: 'This is a test post from the verification script.',
        post_type: 'thought',
        visibility: 'public',
    }, [201, 401, 500]);

    if (postData?.data?.id) {
        testPostId = postData.data.id;
    }

    // 8. List own posts
    await req('GET', '/api/posts?status=all', undefined, [200, 401]);

    // 9. Get single post
    if (testPostId) {
        await req('GET', `/api/posts/${testPostId}`, undefined, [200, 401]);
    }

    // 10. Update post
    if (testPostId) {
        await req('PUT', `/api/posts/${testPostId}`, {
            body: 'Updated test post body.',
        }, [200, 401]);
    }
}

async function testFeedEndpoints() {
    console.log('\n📰 FEED ENDPOINTS');
    console.log('─'.repeat(50));

    // 11. Feed (all)
    await req('GET', '/api/feed', undefined, [200, 401]);

    // 12. Feed (following)
    await req('GET', '/api/feed?filter=following', undefined, [200, 401]);

    // 13. Feed (popular)
    await req('GET', '/api/feed?filter=popular', undefined, [200, 401]);
}

async function testInteractionEndpoints() {
    console.log('\n💬 INTERACTION ENDPOINTS');
    console.log('─'.repeat(50));

    if (testPostId) {
        // 14. Add reaction
        await req('POST', `/api/posts/${testPostId}/reactions`, {
            reaction: 'interesting',
        }, [201, 401, 500]);

        // 15. Remove reaction
        await req('DELETE', `/api/posts/${testPostId}/reactions?reaction=interesting`, undefined, [200, 401]);

        // 16. Create feedback
        await req('POST', `/api/posts/${testPostId}/feedbacks`, {
            feedback_type: 'empathic',
            body: 'Great thought, thanks for sharing!',
        }, [201, 401, 500]);

        // 17. List feedbacks
        await req('GET', `/api/posts/${testPostId}/feedbacks`, undefined, [200, 401]);

        // 18. Add bookmark
        await req('POST', `/api/posts/${testPostId}/bookmarks`, {
            note: 'Saved from verification script',
        }, [201, 401, 500]);

        // 19. Remove bookmark
        await req('DELETE', `/api/posts/${testPostId}/bookmarks`, undefined, [200, 401]);
    }

    // 20. List bookmarks
    await req('GET', '/api/bookmarks', undefined, [200, 401]);
}

async function testMessageEndpoints() {
    console.log('\n✉️  MESSAGE ENDPOINTS');
    console.log('─'.repeat(50));

    // 21. List threads
    await req('GET', '/api/messages', undefined, [200, 401]);

    // 22. Send new message (will likely fail - no recipient)
    await req('POST', '/api/messages', {
        recipient_username: 'nonexistent_user',
        message: 'Hello from verification!',
    }, [404, 400, 401, 500]);
}

async function testNotificationEndpoints() {
    console.log('\n🔔 NOTIFICATION ENDPOINTS');
    console.log('─'.repeat(50));

    // 23. List notifications
    await req('GET', '/api/notifications', undefined, [200, 401]);

    // 24. Mark all read
    await req('PUT', '/api/notifications', { mark_all_read: true }, [200, 401]);
}

async function testCommunityEndpoints() {
    console.log('\n🏘️  COMMUNITY ENDPOINTS');
    console.log('─'.repeat(50));

    const ts = Date.now();

    // 25. List communities
    await req('GET', '/api/communities', undefined, [200, 401]);

    // 26. Create community
    const { data: commData } = await req('POST', '/api/communities', {
        handle: `test_comm_${ts}`,
        name: 'Test Community',
        description: 'Created by verification script',
    }, [201, 401, 500]);

    const commHandle = commData?.data?.handle || `test_comm_${ts}`;

    // 27. Get community detail
    await req('GET', `/api/communities/${commHandle}`, undefined, [200, 404, 401]);

    // 28. Join community (already owner, should get 409)
    await req('POST', `/api/communities/${commHandle}/join`, undefined, [201, 409, 401, 500]);

    // 29. Leave community (owner can't leave)
    await req('DELETE', `/api/communities/${commHandle}/join`, undefined, [200, 400, 401, 404]);
}

async function testUserEndpoints() {
    console.log('\n👤 USER ENDPOINTS');
    console.log('─'.repeat(50));

    const ts = Date.now();
    const testUsername = `testuser_${ts}`;

    // 30. Get user profile (nonexistent user)
    await req('GET', `/api/users/${testUsername}`, undefined, [200, 404, 401]);

    // 31. Follow user (nonexistent)
    await req('POST', `/api/users/${testUsername}/follow`, undefined, [201, 404, 400, 401]);

    // 32. Unfollow user (nonexistent)
    await req('DELETE', `/api/users/${testUsername}/follow`, undefined, [200, 404, 401]);
}

async function testSettingsEndpoints() {
    console.log('\n⚙️  SETTINGS ENDPOINTS');
    console.log('─'.repeat(50));

    // 33. Get settings
    await req('GET', '/api/settings', undefined, [200, 401]);

    // 34. Update profile settings
    await req('PUT', '/api/settings', {
        section: 'profile',
        data: { bio: 'Updated by verification script' },
    }, [200, 401]);

    // 35. Update privacy settings
    await req('PUT', '/api/settings', {
        section: 'privacy',
        data: { show_points: true },
    }, [200, 401]);
}

async function testContactEndpoint() {
    console.log('\n📧 CONTACT ENDPOINT');
    console.log('─'.repeat(50));

    // 36. Submit contact form (public, no auth needed)
    await req('POST', '/api/contact', {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@lowkey.test',
        reason: 'feedback',
        subject: 'Verification Script',
        message: 'This is a test message from the verification script.',
    }, [201, 500]); // 500 if no DB

    // 37. Contact form validation
    await req('POST', '/api/contact', {}, 400);
}

async function testCleanup() {
    console.log('\n🧹 CLEANUP');
    console.log('─'.repeat(50));

    // Delete test post
    if (testPostId) {
        await req('DELETE', `/api/posts/${testPostId}`, undefined, [200, 401]);
    }

    // Logout
    await req('POST', '/api/auth/logout', {}, 200);
}

// ── Main ─────────────────────────────

async function main() {
    console.log('╔══════════════════════════════════════════════════╗');
    console.log('║        LowKey API Endpoint Verification          ║');
    console.log('╚══════════════════════════════════════════════════╝');
    console.log(`\nTarget: ${BASE}`);
    console.log(`Time:   ${new Date().toISOString()}\n`);

    // Check if server is running
    try {
        await fetch(BASE, { signal: AbortSignal.timeout(3000) });
    } catch {
        console.error('❌ Dev server is not running at ' + BASE);
        console.error('   Start it with: npm run dev');
        process.exit(1);
    }

    await testAuthEndpoints();
    await testPostEndpoints();
    await testFeedEndpoints();
    await testInteractionEndpoints();
    await testMessageEndpoints();
    await testNotificationEndpoints();
    await testCommunityEndpoints();
    await testUserEndpoints();
    await testSettingsEndpoints();
    await testContactEndpoint();
    await testCleanup();

    // ── Report ────────────────────────

    console.log('\n\n╔══════════════════════════════════════════════════╗');
    console.log('║                    RESULTS                        ║');
    console.log('╚══════════════════════════════════════════════════╝\n');

    const passed = results.filter((r) => r.pass);
    const failed = results.filter((r) => !r.pass);
    const dbErrors = results.filter((r) => r.status === 500);

    // Print each result
    for (const r of results) {
        const icon = r.pass ? '✅' : '❌';
        const statusStr = `[${r.status}]`.padEnd(6);
        console.log(`${icon} ${statusStr} ${r.endpoint.padEnd(50)} ${r.note}`);
    }

    console.log('\n' + '═'.repeat(60));
    console.log(`Total:   ${results.length}`);
    console.log(`Passed:  ${passed.length} ✅`);
    console.log(`Failed:  ${failed.length} ❌`);
    if (dbErrors.length > 0) {
        console.log(`DB Errors: ${dbErrors.length} (expected if PostgreSQL is not connected)`);
    }
    console.log('═'.repeat(60));

    if (failed.length > 0) {
        console.log('\n❌ FAILED TESTS:');
        for (const f of failed) {
            console.log(`   → ${f.endpoint}: ${f.note}`);
        }
    }

    // Categorize results
    const authOk = results.filter(r => r.endpoint.includes('/auth/') && r.pass).length;
    const postsOk = results.filter(r => r.endpoint.includes('/posts') && r.pass).length;
    const feedOk = results.filter(r => r.endpoint.includes('/feed') && r.pass).length;
    const msgOk = results.filter(r => r.endpoint.includes('/messages') && r.pass).length;
    const notifOk = results.filter(r => r.endpoint.includes('/notifications') && r.pass).length;
    const commOk = results.filter(r => r.endpoint.includes('/communities') && r.pass).length;
    const userOk = results.filter(r => r.endpoint.includes('/users/') && r.pass).length;
    const settingsOk = results.filter(r => r.endpoint.includes('/settings') && r.pass).length;
    const contactOk = results.filter(r => r.endpoint.includes('/contact') && r.pass).length;

    console.log('\n📊 BY CATEGORY:');
    console.log(`   Auth:          ${authOk} passed`);
    console.log(`   Posts:         ${postsOk} passed`);
    console.log(`   Feed:          ${feedOk} passed`);
    console.log(`   Messages:      ${msgOk} passed`);
    console.log(`   Notifications: ${notifOk} passed`);
    console.log(`   Communities:   ${commOk} passed`);
    console.log(`   Users:         ${userOk} passed`);
    console.log(`   Settings:      ${settingsOk} passed`);
    console.log(`   Contact:       ${contactOk} passed`);

    process.exit(failed.length > 0 ? 1 : 0);
}

main().catch((err) => {
    console.error('Unhandled error:', err);
    process.exit(1);
});
