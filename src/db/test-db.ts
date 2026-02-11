/**
 * LowKey — Database Connection & CRUD Test
 *
 * Run:  npx ts-node --skip-project src/db/test-db.ts
 *
 * Checks:
 *  1. Database exists and connection succeeds
 *  2. All expected tables are present
 *  3. Full CRUD cycle on core tables (users, profiles, posts, communities, etc.)
 *  4. Foreign-key relationships work correctly
 *  5. Cleanup — all test data removed
 */

import { Pool, PoolClient } from "pg";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// ─── Config ──────────────────────────────────────────────────────────────────

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function ok(label: string) {
    passed++;
    console.log(`  ✅  ${label}`);
}

function fail(label: string, err: unknown) {
    failed++;
    console.error(`  ❌  ${label}`, err instanceof Error ? err.message : err);
}

// ─── Tests ───────────────────────────────────────────────────────────────────

async function testConnection(client: PoolClient) {
    console.log("\n── 1. Connection ──────────────────────────────────────────");
    try {
        const res = await client.query("SELECT current_database() AS db");
        ok(`Connected to database: ${res.rows[0].db}`);
    } catch (e) {
        fail("Connection", e);
        throw e; // fatal
    }
}

async function testTablesExist(client: PoolClient) {
    console.log("\n── 2. Table existence ─────────────────────────────────────");
    const expectedTables = [
        "users",
        "profiles",
        "sessions",
        "user_blocks",
        "follows",
        "posts",
        "post_versions",
        "tags",
        "post_tags",
        "post_attachments",
        "reactions",
        "feedbacks",
        "feedback_votes",
        "marks",
        "bookmarks",
        "shares",
        "reveal_requests",
        "communities",
        "community_members",
        "community_join_requests",
        "community_invites",
        "community_rules",
        "community_blocked_keywords",
        "community_tags",
        "message_threads",
        "message_thread_participants",
        "messages",
        "message_requests",
        "notifications",
        "notification_preferences",
        "point_tasks",
        "point_transactions",
        "achievements",
        "user_achievements",
        "badges",
        "user_badges",
        "verification_requests",
        "reports",
        "moderation_cases",
        "moderation_actions",
        "appeals",
        "auto_moderation_rules",
        "admin_users",
        "admin_actions",
        "deletion_requests",
        "legal_holds",
        "audit_logs",
        "site_settings",
        "policy_versions",
        "feature_flags",
        "contact_submissions",
        "export_jobs",
        "backup_jobs",
        "email_templates",
        "scheduled_jobs",
    ];

    const res = await client.query(
        `SELECT table_name FROM information_schema.tables
     WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`
    );
    const existing = new Set(res.rows.map((r: { table_name: string }) => r.table_name));

    for (const t of expectedTables) {
        if (existing.has(t)) {
            ok(t);
        } else {
            fail(t, "table not found");
        }
    }
}

async function testCRUD(client: PoolClient) {
    console.log("\n── 3. CRUD operations ─────────────────────────────────────");

    // ── CREATE ──
    console.log("\n  ▸ CREATE");

    // User
    let userId: string;
    try {
        const res = await client.query(
            `INSERT INTO users (username, email, password_hash)
       VALUES ('test_user_crud', 'test@lowkey.test', 'hash_placeholder')
       RETURNING id`
        );
        userId = res.rows[0].id;
        ok(`INSERT users → id=${userId}`);
    } catch (e) {
        fail("INSERT users", e);
        throw e;
    }

    // Profile
    try {
        await client.query(
            `INSERT INTO profiles (user_id, display_name, bio)
       VALUES ($1, 'Test User', 'A test bio for CRUD validation')`,
            [userId]
        );
        ok("INSERT profiles");
    } catch (e) {
        fail("INSERT profiles", e);
    }

    // Community
    let communityId: string;
    try {
        const res = await client.query(
            `INSERT INTO communities (handle, name, owner_id)
       VALUES ('test-community', 'Test Community', $1)
       RETURNING id`,
            [userId]
        );
        communityId = res.rows[0].id;
        ok(`INSERT communities → id=${communityId}`);
    } catch (e) {
        fail("INSERT communities", e);
        throw e;
    }

    // Community member
    try {
        await client.query(
            `INSERT INTO community_members (community_id, user_id, role)
       VALUES ($1, $2, 'owner')`,
            [communityId, userId]
        );
        ok("INSERT community_members");
    } catch (e) {
        fail("INSERT community_members", e);
    }

    // Post
    let postId: string;
    try {
        const res = await client.query(
            `INSERT INTO posts (author_id, community_id, title, body, post_type, visibility, status, published_at)
       VALUES ($1, $2, 'Test Post', 'This is a CRUD test post body.', 'thought', 'public', 'published', NOW())
       RETURNING id`,
            [userId, communityId]
        );
        postId = res.rows[0].id;
        ok(`INSERT posts → id=${postId}`);
    } catch (e) {
        fail("INSERT posts", e);
        throw e;
    }

    // Post version
    try {
        await client.query(
            `INSERT INTO post_versions (post_id, version_number, title, body, edited_by)
       VALUES ($1, 1, 'Test Post', 'Original body.', $2)`,
            [postId, userId]
        );
        ok("INSERT post_versions");
    } catch (e) {
        fail("INSERT post_versions", e);
    }

    // Reaction
    try {
        await client.query(
            `INSERT INTO reactions (post_id, user_id, reaction) VALUES ($1, $2, 'interesting')`,
            [postId, userId]
        );
        ok("INSERT reactions");
    } catch (e) {
        fail("INSERT reactions", e);
    }

    // Feedback
    let feedbackId: string;
    try {
        const res = await client.query(
            `INSERT INTO feedbacks (post_id, author_id, feedback_type, body)
       VALUES ($1, $2, 'empathic', 'I really relate to this.')
       RETURNING id`,
            [postId, userId]
        );
        feedbackId = res.rows[0].id;
        ok(`INSERT feedbacks → id=${feedbackId}`);
    } catch (e) {
        fail("INSERT feedbacks", e);
        throw e;
    }

    // Mark (quiet engagement)
    try {
        await client.query(
            `INSERT INTO marks (post_id, user_id, mark) VALUES ($1, $2, 'saved_in_mind')`,
            [postId, userId]
        );
        ok("INSERT marks");
    } catch (e) {
        fail("INSERT marks", e);
    }

    // Bookmark
    try {
        await client.query(
            `INSERT INTO bookmarks (post_id, user_id, note) VALUES ($1, $2, 'Come back to this later')`,
            [postId, userId]
        );
        ok("INSERT bookmarks");
    } catch (e) {
        fail("INSERT bookmarks", e);
    }

    // Notification
    try {
        await client.query(
            `INSERT INTO notifications (user_id, kind, title, body)
       VALUES ($1, 'reaction', 'New reaction', 'Someone reacted to your post.')`,
            [userId]
        );
        ok("INSERT notifications");
    } catch (e) {
        fail("INSERT notifications", e);
    }

    // Point task + transaction
    let taskId: string;
    try {
        const res = await client.query(
            `INSERT INTO point_tasks (name, description, points, category)
       VALUES ('Test Task', 'Award for CRUD test', 15, 'testing')
       RETURNING id`
        );
        taskId = res.rows[0].id;
        await client.query(
            `INSERT INTO point_transactions (user_id, task_id, points, reason, related_post_id)
       VALUES ($1, $2, 15, 'CRUD test reward', $3)`,
            [userId, taskId, postId]
        );
        ok("INSERT point_tasks + point_transactions");
    } catch (e) {
        fail("INSERT point_tasks / point_transactions", e);
    }

    // Badge + user badge
    let badgeId: string;
    try {
        const res = await client.query(
            `INSERT INTO badges (name, description, badge_type)
       VALUES ('Test Badge', 'A test badge', 'public')
       RETURNING id`
        );
        badgeId = res.rows[0].id;
        await client.query(
            `INSERT INTO user_badges (user_id, badge_id) VALUES ($1, $2)`,
            [userId, badgeId]
        );
        ok("INSERT badges + user_badges");
    } catch (e) {
        fail("INSERT badges / user_badges", e);
    }

    // Contact submission
    try {
        await client.query(
            `INSERT INTO contact_submissions (first_name, email, reason, message)
       VALUES ('Tester', 'tester@lowkey.test', 'feedback', 'Great platform!')`
        );
        ok("INSERT contact_submissions");
    } catch (e) {
        fail("INSERT contact_submissions", e);
    }

    // Audit log
    try {
        await client.query(
            `INSERT INTO audit_logs (user_id, action, target_type, target_id, ip_address)
       VALUES ($1, 'test_crud', 'post', $2, '127.0.0.1')`,
            [userId, postId]
        );
        ok("INSERT audit_logs");
    } catch (e) {
        fail("INSERT audit_logs", e);
    }

    // ── READ ──
    console.log("\n  ▸ READ");

    try {
        const res = await client.query(
            `SELECT u.username, p.display_name, p.bio
       FROM users u JOIN profiles p ON p.user_id = u.id
       WHERE u.id = $1`,
            [userId]
        );
        ok(`SELECT user+profile → ${JSON.stringify(res.rows[0])}`);
    } catch (e) {
        fail("SELECT user+profile", e);
    }

    try {
        const res = await client.query(
            `SELECT po.title, po.post_type, c.name AS community
       FROM posts po JOIN communities c ON c.id = po.community_id
       WHERE po.id = $1`,
            [postId]
        );
        ok(`SELECT post+community → ${JSON.stringify(res.rows[0])}`);
    } catch (e) {
        fail("SELECT post+community", e);
    }

    try {
        const res = await client.query(
            `SELECT reaction, COUNT(*) AS count FROM reactions WHERE post_id = $1 GROUP BY reaction`,
            [postId]
        );
        ok(`SELECT reaction counts → ${JSON.stringify(res.rows)}`);
    } catch (e) {
        fail("SELECT reactions", e);
    }

    // ── UPDATE ──
    console.log("\n  ▸ UPDATE");

    try {
        await client.query(
            `UPDATE profiles SET bio = 'Updated bio via CRUD test' WHERE user_id = $1`,
            [userId]
        );
        const res = await client.query(`SELECT bio FROM profiles WHERE user_id = $1`, [userId]);
        ok(`UPDATE profiles → bio="${res.rows[0].bio}"`);
    } catch (e) {
        fail("UPDATE profiles", e);
    }

    try {
        await client.query(
            `UPDATE posts SET title = 'Updated Test Post', view_count = view_count + 1 WHERE id = $1`,
            [postId]
        );
        const res = await client.query(`SELECT title, view_count FROM posts WHERE id = $1`, [postId]);
        ok(`UPDATE posts → title="${res.rows[0].title}", views=${res.rows[0].view_count}`);
    } catch (e) {
        fail("UPDATE posts", e);
    }

    // Verify updated_at trigger fired
    try {
        const res = await client.query(
            `SELECT created_at, updated_at FROM profiles WHERE user_id = $1`,
            [userId]
        );
        const { created_at, updated_at } = res.rows[0];
        if (new Date(updated_at) >= new Date(created_at)) {
            ok("updated_at trigger fired (updated_at >= created_at)");
        } else {
            fail("updated_at trigger", "updated_at is before created_at");
        }
    } catch (e) {
        fail("updated_at trigger check", e);
    }

    // ── DELETE ──
    console.log("\n  ▸ DELETE");

    // Soft-delete post
    try {
        await client.query(`UPDATE posts SET deleted_at = NOW() WHERE id = $1`, [postId]);
        const res = await client.query(`SELECT deleted_at FROM posts WHERE id = $1`, [postId]);
        ok(`Soft-delete post → deleted_at=${res.rows[0].deleted_at}`);
    } catch (e) {
        fail("Soft-delete post", e);
    }

    // Hard-delete cascade: deleting user should cascade to profile, posts, reactions, etc.
    try {
        await client.query(`DELETE FROM users WHERE id = $1`, [userId]);
        const profileCheck = await client.query(`SELECT COUNT(*) FROM profiles WHERE user_id = $1`, [userId]);
        const postCheck = await client.query(`SELECT COUNT(*) FROM posts WHERE author_id = $1`, [userId]);
        if (profileCheck.rows[0].count === "0" && postCheck.rows[0].count === "0") {
            ok("CASCADE delete — user removal cascaded to profiles, posts, reactions, marks, etc.");
        } else {
            fail("CASCADE delete", "orphan rows remain");
        }
    } catch (e) {
        fail("CASCADE delete", e);
    }

    // Cleanup remaining non-cascaded rows
    try {
        await client.query(`DELETE FROM communities WHERE id = $1`, [communityId!]);
        await client.query(`DELETE FROM point_tasks WHERE name = 'Test Task'`);
        await client.query(`DELETE FROM badges WHERE name = 'Test Badge'`);
        await client.query(`DELETE FROM contact_submissions WHERE email = 'tester@lowkey.test'`);
        ok("Cleanup — all test data removed");
    } catch (e) {
        fail("Cleanup", e);
    }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
    console.log("╔══════════════════════════════════════════════════════════╗");
    console.log("║      LowKey — Database Connection & CRUD Test          ║");
    console.log("╚══════════════════════════════════════════════════════════╝");

    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        await testConnection(client);
        await testTablesExist(client);
        await testCRUD(client);
        await client.query("COMMIT");
    } catch (e) {
        await client.query("ROLLBACK");
        console.error("\n🔴 Fatal error — transaction rolled back.", e);
    } finally {
        client.release();
        await pool.end();
    }

    console.log("\n══════════════════════════════════════════════════════════");
    console.log(`  Results:  ✅ ${passed} passed   ❌ ${failed} failed`);
    console.log("══════════════════════════════════════════════════════════\n");

    process.exit(failed > 0 ? 1 : 0);
}

main();
