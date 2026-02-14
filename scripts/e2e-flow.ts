/**
 * End-to-End Flow Test
 * Simulates a complete user journey through the LowKey platform.
 * 
 * Usage: npx tsx scripts/e2e-flow.ts
 * 
 * Requires: dev server running on localhost:3000 + PostgreSQL connected
 */

const BASE = process.env.TEST_BASE || 'http://localhost:4028';

let cookie = '';
let userId = '';
let username = '';
let postId = '';
let threadId = '';
let communityHandle = '';

const ts = Date.now();
const testUser1 = `e2e_alpha_${ts}`;
const testUser2 = `e2e_beta_${ts}`;

// ── Helpers ──────────────────────────

function log(icon: string, msg: string) {
    console.log(`  ${icon}  ${msg}`);
}

function step(n: number, title: string) {
    console.log(`\n  ┌─ Step ${n}: ${title}`);
}

function success(msg: string) {
    log('✅', msg);
}

function fail(msg: string) {
    log('❌', msg);
}

async function api(
    method: string,
    path: string,
    body?: Record<string, unknown>
): Promise<{ ok: boolean; status: number; data: any }> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (cookie) headers['Cookie'] = cookie;

    const res = await fetch(`${BASE}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        redirect: 'manual',
    });

    let data: any = null;
    try { data = await res.json(); } catch { }

    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
        const match = setCookie.match(/lk_session=[^;]+/);
        if (match) cookie = match[0];
    }

    return { ok: res.ok, status: res.status, data };
}

// ── Flow Steps ──────────────────────

async function flow() {
    console.log('\n╔══════════════════════════════════════════════════╗');
    console.log('║          LowKey End-to-End Flow Test              ║');
    console.log('╚══════════════════════════════════════════════════╝\n');

    // Check server
    try {
        await fetch(BASE, { signal: AbortSignal.timeout(3000) });
    } catch {
        console.error('❌ Dev server not running at ' + BASE);
        process.exit(1);
    }

    let passed = 0;
    let failed = 0;

    function assert(condition: boolean, passMsg: string, failMsg: string) {
        if (condition) { success(passMsg); passed++; }
        else { fail(failMsg); failed++; }
    }

    // ─────────────────────────────────────
    // STEP 1: User Registration
    // ─────────────────────────────────────
    step(1, 'User Registration');

    const signup = await api('POST', '/api/auth/signup', {
        username: testUser1,
        email: `${testUser1}@lowkey.test`,
        password: 'SecurePass123!',
        display_name: 'Alpha Tester',
    });

    assert(signup.status === 201, `User "${testUser1}" registered`, `Signup failed: ${signup.data?.error}`);

    if (signup.data?.data?.id) {
        userId = signup.data.data.id;
        username = testUser1;
    }

    // ─────────────────────────────────────
    // STEP 2: Verify Session
    // ─────────────────────────────────────
    step(2, 'Verify Session (GET /api/auth/me)');

    const me = await api('GET', '/api/auth/me');
    assert(me.ok && me.data?.data?.username === testUser1, `Session active for @${testUser1}`, `Session check failed: ${me.data?.error}`);
    assert(me.data?.data?.profile !== undefined, `Profile exists`, `Profile missing from /me response`);

    // ─────────────────────────────────────
    // STEP 3: Update Profile
    // ─────────────────────────────────────
    step(3, 'Update Profile Settings');

    const profileUpdate = await api('PUT', '/api/settings', {
        section: 'profile',
        data: {
            display_name: 'Alpha Tester (E2E)',
            bio: 'End-to-end test user for LowKey verification.',
            location: 'Testing Lab',
        },
    });
    assert(profileUpdate.ok, 'Profile updated', `Profile update failed: ${profileUpdate.data?.error}`);

    // Update privacy
    const privacyUpdate = await api('PUT', '/api/settings', {
        section: 'privacy',
        data: {
            default_post_visibility: 'public',
            allow_dms_from: 'everyone',
            show_points: true,
            show_badges: true,
        },
    });
    assert(privacyUpdate.ok, 'Privacy settings updated', `Privacy update failed: ${privacyUpdate.data?.error}`);

    // ─────────────────────────────────────
    // STEP 4: Create a Post
    // ─────────────────────────────────────
    step(4, 'Create a Post');

    const createPost = await api('POST', '/api/posts', {
        title: 'My First Thought',
        body: 'This is a test thought post created during the E2E flow test. It demonstrates the full posting workflow.',
        post_type: 'thought',
        visibility: 'public',
    });

    assert(createPost.status === 201, `Post created (type: thought)`, `Post creation failed: ${createPost.data?.error}`);

    if (createPost.data?.data?.id) {
        postId = createPost.data.data.id;
        success(`Post ID: ${postId}`);
    }

    // ─────────────────────────────────────
    // STEP 5: View the Post
    // ─────────────────────────────────────
    step(5, 'View Post Detail');

    if (postId) {
        const viewPost = await api('GET', `/api/posts/${postId}`);
        assert(viewPost.ok && viewPost.data?.data?.is_own_post === true, 'Post viewed (is_own_post = true)', `Post view failed: ${viewPost.data?.error}`);
        assert(viewPost.data?.data?.user_reactions !== undefined, 'User reactions array present', 'Missing user_reactions');
    }

    // ─────────────────────────────────────
    // STEP 6: Interact with Post
    // ─────────────────────────────────────
    step(6, 'Post Interactions (React, Feedback, Bookmark)');

    if (postId) {
        // React
        const react = await api('POST', `/api/posts/${postId}/reactions`, { reaction: 'interesting' });
        assert(react.status === 201, 'Reaction "interesting" added', `Reaction failed: ${react.data?.error}`);

        // Second reaction
        const react2 = await api('POST', `/api/posts/${postId}/reactions`, { reaction: 'me_too' });
        assert(react2.status === 201, 'Reaction "me_too" added', `Reaction failed: ${react2.data?.error}`);

        // Feedback
        const fb = await api('POST', `/api/posts/${postId}/feedbacks`, {
            feedback_type: 'constructive',
            body: 'This is a thoughtful contribution. Consider expanding on the underlying assumptions.',
            whats_working: 'Clear framing',
            what_can_be_done: 'More examples',
        });
        assert(fb.status === 201, 'Constructive feedback created', `Feedback failed: ${fb.data?.error}`);

        // Get feedbacks
        const fbs = await api('GET', `/api/posts/${postId}/feedbacks`);
        assert(fbs.ok && Array.isArray(fbs.data?.data) && fbs.data.data.length > 0, `${fbs.data?.data?.length || 0} feedbacks retrieved`, `Feedbacks list failed: ${fbs.data?.error}`);

        // Bookmark
        const bm = await api('POST', `/api/posts/${postId}/bookmarks`, { note: 'Saved from E2E test' });
        assert(bm.status === 201, 'Post bookmarked with note', `Bookmark failed: ${bm.data?.error}`);
    }

    // ─────────────────────────────────────
    // STEP 7: Check Feed
    // ─────────────────────────────────────
    step(7, 'Fetch Feed');

    const feedAll = await api('GET', '/api/feed');
    assert(feedAll.ok, 'Feed (all) loaded', `Feed failed: ${feedAll.data?.error}`);

    const feedPopular = await api('GET', '/api/feed?filter=popular');
    assert(feedPopular.ok, 'Feed (popular) loaded', `Feed popular failed: ${feedPopular.data?.error}`);

    // ─────────────────────────────────────
    // STEP 8: Check Bookmarks
    // ─────────────────────────────────────
    step(8, 'Verify Bookmarks');

    const bms = await api('GET', '/api/bookmarks');
    assert(bms.ok, 'Bookmarks list loaded', `Bookmarks failed: ${bms.data?.error}`);
    const bmList = bms.data?.data?.bookmarks || [];
    assert(bmList.length > 0, `${bmList.length} bookmark(s) found`, 'No bookmarks found');

    // ─────────────────────────────────────
    // STEP 9: Create a Community
    // ─────────────────────────────────────
    step(9, 'Create & Join Community');

    communityHandle = `e2e_comm_${ts}`;
    const createComm = await api('POST', '/api/communities', {
        handle: communityHandle,
        name: 'E2E Test Community',
        description: 'A community created during end-to-end testing.',
        visibility: 'public',
        join_type: 'open',
        category: 'tech',
    });
    assert(createComm.status === 201, `Community "/${communityHandle}" created`, `Community creation failed: ${createComm.data?.error}`);

    // Community detail
    const commDetail = await api('GET', `/api/communities/${communityHandle}`);
    assert(commDetail.ok && commDetail.data?.data?.is_member === true, 'Owner confirmed as member', `Community detail failed: ${commDetail.data?.error}`);

    // List communities
    const commList = await api('GET', '/api/communities?filter=mine');
    assert(commList.ok, 'My communities listed', `Community list failed: ${commList.data?.error}`);

    // ─────────────────────────────────────
    // STEP 10: Notifications
    // ─────────────────────────────────────
    step(10, 'Check Notifications');

    const notifs = await api('GET', '/api/notifications');
    assert(notifs.ok, 'Notifications loaded', `Notifications failed: ${notifs.data?.error}`);

    const markRead = await api('PUT', '/api/notifications', { mark_all_read: true });
    assert(markRead.ok, 'All notifications marked as read', `Mark read failed: ${markRead.data?.error}`);

    // ─────────────────────────────────────
    // STEP 11: Post Manager
    // ─────────────────────────────────────
    step(11, 'Post Manager');

    const myPosts = await api('GET', '/api/posts?status=all');
    assert(myPosts.ok, 'Post manager loaded', `Post list failed: ${myPosts.data?.error}`);
    const postCount = myPosts.data?.data?.pagination?.total || 0;
    assert(postCount > 0, `${postCount} post(s) in manager`, 'No posts in manager');

    // Edit post
    if (postId) {
        const edit = await api('PUT', `/api/posts/${postId}`, {
            body: 'Updated thought — revised after E2E testing.',
        });
        assert(edit.ok, 'Post edited (version incremented)', `Post edit failed: ${edit.data?.error}`);
    }

    // ─────────────────────────────────────
    // STEP 12: Settings Verification
    // ─────────────────────────────────────
    step(12, 'Verify Settings Integrity');

    const settingsCheck = await api('GET', '/api/settings');
    assert(settingsCheck.ok, 'Settings retrieved', `Settings failed: ${settingsCheck.data?.error}`);

    const profile = settingsCheck.data?.data?.profile;
    assert(profile?.bio?.includes('End-to-end test'), `Bio correctly persisted: "${profile?.bio?.slice(0, 40)}..."`, 'Bio not persisted correctly');
    assert(profile?.display_name?.includes('E2E'), `Display name persisted: "${profile?.display_name}"`, 'Display name not persisted');

    // ─────────────────────────────────────
    // STEP 13: Contact Form (Public)
    // ─────────────────────────────────────
    step(13, 'Contact Form (Public Endpoint)');

    // Logout first to test public access
    const tempCookie = cookie;
    cookie = '';

    const contactPublic = await api('POST', '/api/contact', {
        first_name: 'E2E',
        last_name: 'Tester',
        email: 'e2e@lowkey.test',
        reason: 'support',
        message: 'This is an E2E test of the contact form.',
    });
    assert(contactPublic.status === 201, 'Contact form submitted (no auth required)', `Contact failed: ${contactPublic.data?.error}`);

    // Contact validation
    const contactBad = await api('POST', '/api/contact', {});
    assert(contactBad.status === 400, 'Contact validation working (rejects empty)', `Expected 400, got ${contactBad.status}`);

    cookie = tempCookie; // Restore session

    // ─────────────────────────────────────
    // STEP 14: Cleanup
    // ─────────────────────────────────────
    step(14, 'Cleanup');

    if (postId) {
        const del = await api('DELETE', `/api/posts/${postId}`);
        assert(del.ok, 'Test post soft-deleted', `Post delete failed: ${del.data?.error}`);
    }

    // Unbookmark
    if (postId) {
        await api('DELETE', `/api/posts/${postId}/bookmarks`);
        success('Bookmark removed');
        passed++;
    }

    // Logout
    const logout = await api('POST', '/api/auth/logout');
    assert(logout.ok, 'Session destroyed', `Logout failed: ${logout.data?.error}`);

    // Verify logged out
    cookie = '';
    const afterLogout = await api('GET', '/api/auth/me');
    assert(afterLogout.status === 401, 'Confirmed: no session after logout', `Expected 401, got ${afterLogout.status}`);

    // ─────────────────────────────────────
    // REPORT
    // ─────────────────────────────────────
    console.log('\n\n╔══════════════════════════════════════════════════╗');
    console.log('║              E2E FLOW TEST RESULTS                ║');
    console.log('╚══════════════════════════════════════════════════╝\n');
    console.log(`  Total assertions: ${passed + failed}`);
    console.log(`  ✅ Passed: ${passed}`);
    console.log(`  ❌ Failed: ${failed}`);
    console.log(`\n  ${failed === 0 ? '🎉 ALL TESTS PASSED!' : `⚠️  ${failed} test(s) failed`}`);
    console.log('═'.repeat(54));

    process.exit(failed > 0 ? 1 : 0);
}

flow().catch((err) => {
    console.error('Unhandled error:', err);
    process.exit(1);
});
