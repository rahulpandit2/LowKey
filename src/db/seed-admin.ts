import { config } from 'dotenv';
import { query, getOne } from '../lib/db';

config({ path: '.env.local' });
config();

async function seedAdmin() {
    try {
        console.log('--- Seeding Default Admin User ---');

        // Check if any admin already exists
        const existingAdmin = await getOne<{ user_id: string }>(
            `SELECT user_id FROM admin_users WHERE is_active = true LIMIT 1`
        );

        if (existingAdmin) {
            console.log(`Admin already exists (user_id: ${existingAdmin.user_id}). Skipping seed.`);
            process.exit(0);
        }

        const username = process.env.DEFAULT_ADMIN_USERNAME || 'admin';
        const email = process.env.DEFAULT_ADMIN_EMAIL || 'admin@lowkey.internal';
        const password = process.env.DEFAULT_ADMIN_PASSWORD || 'P@ssword123';

        // Check if the username already exists
        let user = await getOne<{ id: string }>(
            `SELECT id FROM users WHERE username = $1 LIMIT 1`,
            [username]
        );

        if (!user) {
            // Create user with pgcrypto hash
            const insertUserResult = await query<{ id: string }>(
                `INSERT INTO users (
                    username, email, password_hash, role, status,
                    email_verified, onboarding_completed
                ) VALUES (
                    $1, $2, crypt($3, gen_salt('bf', 10)), 'admin', 'active', true, true
                ) RETURNING id`,
                [username, email, password]
            );
            user = insertUserResult.rows[0];

            // Create profile
            await query(
                `INSERT INTO profiles (user_id, display_name, bio)
                 VALUES ($1, 'Server Admin', 'Default system administrator')`,
                [user.id]
            );

            console.log(`Created admin user (id: ${user.id})`);
        } else {
            console.log(`User "${username}" already exists. Promoting to admin.`);
        }

        // Create admin record
        await query(
            `INSERT INTO admin_users (user_id, admin_role, is_active, mfa_enabled)
             VALUES ($1, 'super_admin', true, false)
             ON CONFLICT (user_id) DO UPDATE SET
             admin_role = 'super_admin', is_active = true`,
            [user.id]
        );

        console.log(`Admin setup complete. Login: username=${username}, password=***`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
}

seedAdmin();
