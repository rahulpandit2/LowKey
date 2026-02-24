import { config } from 'dotenv';
import { query } from '../lib/db';

config({ path: '.env.local' });
config();

export async function insertDemoData() {
    console.log('--- Inserting Demo Data ---');
    try {
        await query('BEGIN');

        // 1. Insert Demo Users
        console.log('Inserting demo users...');
        const user1Res = await query<{ id: string }>(
            `INSERT INTO users (username, email, password_hash, role, status, email_verified, onboarding_completed)
             VALUES ('demo_alice', 'alice@demo.lowkey', crypt('password123', gen_salt('bf', 10)), 'user', 'active', true, true)
             ON CONFLICT (username) DO NOTHING RETURNING id`
        );
        const user1Id = user1Res.rows[0]?.id;

        const user2Res = await query<{ id: string }>(
            `INSERT INTO users (username, email, password_hash, role, status, email_verified, onboarding_completed)
             VALUES ('demo_bob', 'bob@demo.lowkey', crypt('password123', gen_salt('bf', 10)), 'user', 'active', true, true)
             ON CONFLICT (username) DO NOTHING RETURNING id`
        );
        const user2Id = user2Res.rows[0]?.id;

        if (user1Id) {
            await query(`INSERT INTO profiles (user_id, display_name, bio) VALUES ($1, 'Demo Alice', 'Demo user profile') ON CONFLICT DO NOTHING`, [user1Id]);
        }
        if (user2Id) {
            await query(`INSERT INTO profiles (user_id, display_name, bio) VALUES ($1, 'Demo Bob', 'Another demo user') ON CONFLICT DO NOTHING`, [user2Id]);
        }

        // 2. Insert Demo Community
        console.log('Inserting demo community...');
        let communityId: string | undefined;
        if (user1Id) {
            const commRes = await query<{ id: string }>(
                `INSERT INTO communities (handle, name, owner_id, description, category)
                 VALUES ('demo-tech', 'Demo Tech Community', $1, 'A community for demo purposes', 'technology')
                 ON CONFLICT (handle) DO NOTHING RETURNING id`,
                [user1Id]
            );
            communityId = commRes.rows[0]?.id;

            if (communityId && user2Id) {
                await query(`INSERT INTO community_members (community_id, user_id, role) VALUES ($1, $2, 'member') ON CONFLICT DO NOTHING`, [communityId, user2Id]);
            }
        }

        // 3. Insert Demo Post
        console.log('Inserting demo posts...');
        let post1Id: string | undefined;
        if (user1Id && communityId) {
            const postRes = await query<{ id: string }>(
                `INSERT INTO posts (author_id, community_id, title, body, post_type, visibility, status, published_at)
                 VALUES ($1, $2, 'Demo Post', 'This is a demo post explaining demo things.', 'thought', 'public', 'published', NOW())
                 RETURNING id`,
                [user1Id, communityId]
            );
            post1Id = postRes.rows[0]?.id;
        }

        // 4. Insert Demo Reactions/Feedback
        if (post1Id && user2Id) {
            console.log('Inserting demo reactions and feedback...');
            await query(`INSERT INTO reactions (post_id, user_id, reaction) VALUES ($1, $2, 'interesting') ON CONFLICT DO NOTHING`, [post1Id, user2Id]);
            await query(`INSERT INTO feedbacks (post_id, author_id, feedback_type, body) VALUES ($1, $2, 'empathic', 'I agree with this demo post.')`, [post1Id, user2Id]);
            await query(`INSERT INTO marks (post_id, user_id, mark) VALUES ($1, $2, 'saved_in_mind') ON CONFLICT DO NOTHING`, [post1Id, user2Id]);
        }

        await query('COMMIT');
        console.log('Demo data inserted successfully.');
    } catch (e) {
        await query('ROLLBACK');
        console.error('Failed to insert demo data', e);
        throw e;
    }
}

if (require.main === module) {
    insertDemoData().then(() => process.exit(0)).catch(() => process.exit(1));
}
