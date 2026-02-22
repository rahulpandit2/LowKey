import { redirect } from 'next/navigation';
import { getOne } from '@/lib/db';

export default async function ServerAdminPage() {
  // Check if setup is needed
  const anyAdmin = await getOne<{ id: string }>(
    `SELECT id FROM admin_users WHERE is_active = true LIMIT 1`
  );

  if (!anyAdmin) {
    redirect('/server-admin/setup');
  }

  // If admin exists, redirect to overview
  redirect('/server-admin/overview');
}
