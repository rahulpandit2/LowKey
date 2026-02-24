import { config } from 'dotenv';
import { query } from '../lib/db';

config({ path: '.env.local' });
config();

export async function purgeDemoData() {
    console.log('--- Purging Demo Data ---');
    try {
        await query('BEGIN');

        // Find all demo users to delete
        const usersRes = await query<{ id: string }>(
            `SELECT id FROM users WHERE username LIKE 'demo_%'`
        );
        const userIds = usersRes.rows.map(r => r.id);

        if (userIds.length > 0) {
            console.log(`Deleting ${userIds.length} demo users and cascaded data...`);
            // Delete users (cascading takes care of profiles, posts, etc)
            await query(`DELETE FROM users WHERE id = ANY($1)`, [userIds]);
        } else {
            console.log('No demo users found.');
        }

        // Find and delete any demo communities that may be left over (if owner wasn't a demo user or it was created without owner)
        const commRes = await query<{ id: string }>(
            `SELECT id FROM communities WHERE handle LIKE 'demo-%'`
        );
        const commIds = commRes.rows.map(r => r.id);

        if (commIds.length > 0) {
            console.log(`Deleting ${commIds.length} demo communities...`);
            await query(`DELETE FROM communities WHERE id = ANY($1)`, [commIds]);
        } else {
            console.log('No demo communities found.');
        }

        await query('COMMIT');
        console.log('Demo data purged successfully.');
    } catch (e) {
        await query('ROLLBACK');
        console.error('Failed to purge demo data', e);
        throw e;
    }
}

if (require.main === module) {
    purgeDemoData().then(() => process.exit(0)).catch(() => process.exit(1));
}
