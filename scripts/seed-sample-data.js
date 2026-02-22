const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'postgres_db_lowkey',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'pass',
});

async function hashPassword(password) {
    const result = await pool.query(
        `SELECT crypt($1, gen_salt('bf', 10)) AS hash`,
        [password]
    );
    return result.rows[0].hash;
}

async function seedData() {
    console.log('🌱 Starting database seeding...');

    try {
        // Create sample users
        console.log('Creating sample users...');
        const password = await hashPassword('password123');

        const users = [
            { username: 'rahul_pandit', email: 'rahul@lowkey.com', display_name: 'Rahul Pandit', bio: 'Founder of LowKey. Building a better internet.' },
            { username: 'sarah_writer', email: 'sarah@example.com', display_name: 'Sarah Chen', bio: 'Writer and thinker. Sharing reflections on life and creativity.' },
            { username: 'alex_maker', email: 'alex@example.com', display_name: 'Alex Kumar', bio: 'Indie maker building in public. Always learning.' },
            { username: 'priya_dev', email: 'priya@example.com', display_name: 'Priya Sharma', bio: 'Software developer. Passionate about clean code and mental health.' },
            { username: 'john_parent', email: 'john@example.com', display_name: 'John Miller', bio: 'Parent of two. Navigating the beautiful chaos of family life.' },
        ];

        const userIds = [];

        for (const user of users) {
            const result = await pool.query(
                `INSERT INTO users (username, email, password_hash, status, email_verified, onboarding_completed)
         VALUES ($1, $2, $3, 'active', true, true)
         ON CONFLICT (username) DO UPDATE SET email = EXCLUDED.email
         RETURNING id`,
                [user.username, user.email, password]
            );
            const userId = result.rows[0].id;
            userIds.push(userId);

            // Create profile
            await pool.query(
                `INSERT INTO profiles (user_id, display_name, bio, default_post_visibility, points_balance)
         VALUES ($1, $2, $3, 'public', 100)
         ON CONFLICT (user_id) DO UPDATE SET display_name = EXCLUDED.display_name, bio = EXCLUDED.bio`,
                [userId, user.display_name, user.bio]
            );
        }

        console.log(`✅ Created ${users.length} users`);

        // Create sample communities
        console.log('Creating sample communities...');
        const communities = [
            { handle: 'reflective-writers', name: 'Reflective Writers', description: 'Share essays, get thoughtful feedback on structure and clarity', owner_idx: 1 },
            { handle: 'indie-makers', name: 'Indie Makers', description: 'Build in public, receive constructive critiques on products', owner_idx: 2 },
            { handle: 'mindful-parents', name: 'Mindful Parents', description: 'Navigate parenting challenges with empathy, no judgment', owner_idx: 4 },
            { handle: 'learning-public', name: 'Learning in Public', description: 'Share progress, celebrate growth, get feedback on learning paths', owner_idx: 3 },
        ];

        const communityIds = [];

        for (const community of communities) {
            const result = await pool.query(
                `INSERT INTO communities (handle, name, description, owner_id, visibility, join_type, status)
         VALUES ($1, $2, $3, $4, 'public', 'open', 'active')
         ON CONFLICT (handle) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
                [community.handle, community.name, community.description, userIds[community.owner_idx]]
            );
            const communityId = result.rows[0].id;
            communityIds.push(communityId);

            // Add owner as member
            await pool.query(
                `INSERT INTO community_members (community_id, user_id, role)
         VALUES ($1, $2, 'owner')
         ON CONFLICT (community_id, user_id) DO NOTHING`,
                [communityId, userIds[community.owner_idx]]
            );
        }

        console.log(`✅ Created ${communities.length} communities`);

        // Create sample posts
        console.log('Creating sample posts...');
        const posts = [
            {
                author_idx: 0,
                title: 'Why I Built LowKey',
                body: 'I used to dread the word "perfect." Not because I was humble, but because it felt like a dead end—and I was nowhere near finished. There were nights when the silence was deafening. I was full of self-doubt, facing conflicts I didn\'t know how to resolve. When I finally reached out for help, the internet didn\'t offer me a place to talk; it offered me rehab. I built LowKey because I needed a place that didn\'t exist: a space for emotional support that isn\'t a clinical diagnosis.',
                post_type: 'thought',
                community_idx: null,
            },
            {
                author_idx: 1,
                title: 'Struggling with Writer\'s Block',
                body: 'I\'ve been staring at a blank page for three days now. Every time I try to write, I second-guess every word. The pressure to create something "perfect" is paralyzing me. Has anyone else experienced this? How do you push through?',
                post_type: 'problem',
                community_idx: 0,
            },
            {
                author_idx: 2,
                title: 'Launched My First SaaS Product!',
                body: 'After 6 months of building in public, I finally launched my productivity app today. Got my first 10 paying customers within 2 hours! The journey was tough but so worth it. To anyone building something: keep going, even when it feels impossible.',
                post_type: 'achievement',
                community_idx: 1,
            },
            {
                author_idx: 3,
                title: 'Career Change: Stay Safe or Take the Leap?',
                body: 'I have a stable job as a software developer, but I\'m not passionate about it anymore. I want to transition into UX design, but it means starting from scratch with a pay cut. Should I stay in my comfort zone or follow my passion? I have a family to support.',
                post_type: 'dilemma',
                community_idx: 3,
            },
            {
                author_idx: 4,
                title: null,
                body: 'I feel like I\'m failing as a parent. My kids are constantly fighting, and I lose my temper more than I\'d like to admit. I love them so much, but some days I feel completely overwhelmed. Is this normal? How do other parents cope?',
                post_type: 'help',
                community_idx: 2,
                is_incognito: true,
            },
            {
                author_idx: 1,
                title: 'The Power of Morning Pages',
                body: 'Started doing Julia Cameron\'s "Morning Pages" - writing 3 pages of stream-of-consciousness every morning. It\'s been transformative for my creativity and mental clarity. Highly recommend for anyone feeling stuck.',
                post_type: 'thought',
                community_idx: 0,
            },
            {
                author_idx: 3,
                title: 'Learning React - Week 3 Update',
                body: 'Completed my third week of learning React. Built a todo app and a weather dashboard. The hooks concept finally clicked! Next week: diving into state management with Context API. Documenting my journey helps me stay accountable.',
                post_type: 'achievement',
                community_idx: 3,
            },
            {
                author_idx: 2,
                title: 'Need Feedback on My Landing Page',
                body: 'Working on the landing page for my new project. I\'m torn between a minimalist design and something more vibrant. My target audience is creative professionals. What do you think resonates better with that demographic?',
                post_type: 'problem',
                community_idx: 1,
            },
        ];

        for (const post of posts) {
            const result = await pool.query(
                `INSERT INTO posts (author_id, community_id, title, body, post_type, visibility, status, is_incognito, published_at, reaction_count, feedback_count)
         VALUES ($1, $2, $3, $4, $5, $6, 'published', $7, NOW() - INTERVAL '${Math.floor(Math.random() * 48)} hours', ${Math.floor(Math.random() * 20)}, ${Math.floor(Math.random() * 10)})
         RETURNING id`,
                [
                    userIds[post.author_idx],
                    post.community_idx !== null ? communityIds[post.community_idx] : null,
                    post.title,
                    post.body,
                    post.post_type,
                    post.is_incognito ? 'incognito' : 'public',
                    post.is_incognito || false,
                ]
            );
        }

        console.log(`✅ Created ${posts.length} posts`);

        // Add some follows
        console.log('Creating follow relationships...');
        const followPairs = [
            [userIds[0], userIds[1]],
            [userIds[0], userIds[2]],
            [userIds[1], userIds[0]],
            [userIds[2], userIds[0]],
            [userIds[3], userIds[0]],
        ];

        for (const [follower, following] of followPairs) {
            await pool.query(
                `INSERT INTO follows (follower_id, following_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
                [follower, following]
            );
        }

        console.log('✅ Created follow relationships');

        console.log('\n🎉 Database seeding completed successfully!');
        console.log('\nSample credentials:');
        console.log('Username: rahul_pandit | Password: password123');
        console.log('Username: sarah_writer | Password: password123');
        console.log('Username: alex_maker | Password: password123');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    } finally {
        await pool.end();
    }
}

seedData();
