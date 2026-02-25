import React from 'react';
import { Outfit } from 'next/font/google';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getCurrentUser, getAdminCurrentUser } from '@/lib/auth';
import { getOne } from '@/lib/db';
import Link from 'next/link';
import AdminLogoutButton from './AdminLogoutButton';
import AdminNav from './AdminNav';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});


export default async function ServerAdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const isPublicAdminPage = pathname.endsWith('/login') || pathname.endsWith('/setup');

  if (isPublicAdminPage) {
    return (
      <div className={`${outfit.variable} font-sans min-h-screen bg-black text-white`}>
        {children}
      </div>
    );
  }

  // Check if any admin exists for first-time setup
  const anyAdmin = await getOne<{ id: string }>(
    `SELECT id FROM admin_users WHERE is_active = true LIMIT 1`
  );

  if (!anyAdmin) {
    return (
      <div className={`${outfit.variable} font-sans min-h-screen bg-zinc-950 text-white`}>
        {children}
      </div>
    );
  }

  // Authenticate admin session
  const adminUser = await getAdminCurrentUser();
  if (!adminUser) {
    redirect('/server-admin/login');
  }

  const adminRecord = await getOne<{ admin_role: string; is_active: boolean }>(
    `SELECT admin_role, is_active FROM admin_users WHERE user_id = $1 AND is_active = true`,
    [adminUser.id]
  );

  if (!adminRecord) {
    redirect('/feed');
  }

  // Check if a normal user session is active to display contextual switch prompt
  const regularUser = await getCurrentUser();
  const isRegularUserActive = !!regularUser;

  return (
    <div className={`${outfit.variable} font-sans min-h-screen bg-zinc-950 text-white flex`}>
      <aside className="w-64 border-r border-white/[0.06] bg-black flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-white/[0.06]">
          <Link href="/server-admin" className="flex items-center gap-2">
            <span className="font-serif text-lg text-white">LowKey</span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-red-400 font-medium bg-red-400/10 px-2 py-0.5 rounded-sm">Admin</span>
          </Link>
          <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">
            {adminRecord.admin_role.replace('_', ' ')}
          </p>
        </div>

        <AdminNav />

        <div className="p-4 border-t border-white/[0.06] space-y-2">
          {isRegularUserActive ? (
            <Link
              href="/feed"
              className="flex items-center gap-2 px-3 py-2 text-xs text-amber-500 hover:text-amber-400 transition-colors bg-amber-500/10 rounded"
            >
              Switch to User
            </Link>
          ) : (
            <Link
              href="/feed"
              className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-500 hover:text-white transition-colors"
            >
              ← Back to App
            </Link>
          )}
          <AdminLogoutButton />
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-8">{children}</main>
    </div>
  );
}
