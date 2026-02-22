import React from 'react';
import { Outfit } from 'next/font/google';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getCurrentUser } from '@/lib/auth';
import { getOne } from '@/lib/db';
import Link from 'next/link';
import AdminLogoutButton from './AdminLogoutButton';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

const adminNav = [
  // Core
  { id: 'admin_dashboard', label: '⌂ Dashboard', href: '/server-admin/overview' },
  { id: 'admin_users', label: '· Users', href: '/server-admin/users' },
  { id: 'admin_sub_admins', label: '· Sub-Admins', href: '/server-admin/sub-admins' },
  { id: 'admin_communities', label: '· Communities', href: '/server-admin/communities' },
  // Moderation
  { id: 'admin_moderation', label: '⚑ Moderation', href: '/server-admin/moderation' },
  { id: 'admin_contact', label: '· Contact Requests', href: '/server-admin/contact-requests' },
  { id: 'admin_deletion', label: '· Deletion Requests', href: '/server-admin/deletion' },
  // Content & Policy
  { id: 'admin_achievements', label: '⬡ Achievements', href: '/server-admin/achievements' },
  { id: 'admin_policies', label: '· Policy Editor', href: '/server-admin/policy' },
  { id: 'admin_legal', label: '· Legal', href: '/server-admin/legal' },
  // Comms
  { id: 'admin_send_notif', label: '✉ Send Notification', href: '/server-admin/send-notification' },
  { id: 'admin_send_msg', label: '· Send Message', href: '/server-admin/send-message' },
  // Infrastructure
  { id: 'admin_security', label: '⛨ Security', href: '/server-admin/security' },
  { id: 'admin_logs', label: '· Audit Logs', href: '/server-admin/logs' },
  { id: 'admin_backups', label: '· Backups', href: '/server-admin/backups' },
  { id: 'admin_automation', label: '· Automation', href: '/server-admin/automation' },
  { id: 'admin_integrations', label: '· Integrations', href: '/server-admin/integrations' },
  { id: 'admin_maintenance', label: '· Maintenance', href: '/server-admin/maintenance' },
  // Admin Sys
  { id: 'admin_profile', label: '⊙ My Profile', href: '/server-admin/profile' },
  { id: 'admin_settings', label: '⚙ Settings', href: '/server-admin/settings' },
  { id: 'admin_help', label: '· Help & Docs', href: '/server-admin/help' },
];

export default async function ServerAdminLayout({ children }: { children: React.ReactNode }) {
  // ── Detect if we are on the login or setup page ───────────────────────────
  // The layout wraps ALL /server-admin/* routes including /server-admin/login.
  // Without this check, unauthenticated users hit the layout → redirect(/login)
  // → layout again → infinite loop (ERR_TOO_MANY_REDIRECTS).
  const headersList = await headers();
  const pathname = headersList.get('x-invoke-path') || headersList.get('x-pathname') || '';
  const isPublicAdminPage = pathname.endsWith('/login') || pathname.endsWith('/setup');

  if (isPublicAdminPage) {
    // Render with no auth check — just the bare page
    return (
      <div className={`${outfit.variable} font-sans min-h-screen bg-black text-white`}>
        {children}
      </div>
    );
  }

  // ── Auth guard ─────────────────────────────────────────────────────────────
  const user = await getCurrentUser();

  // Check if any admin exists (for first-time setup)
  const anyAdmin = await getOne<{ id: string }>(
    `SELECT id FROM admin_users WHERE is_active = true LIMIT 1`
  );

  // No admins yet — show setup/children without sidebar
  if (!anyAdmin) {
    return (
      <div className={`${outfit.variable} font-sans min-h-screen bg-zinc-950 text-white`}>
        {children}
      </div>
    );
  }

  // Admins exist — require an authenticated admin session
  if (!user) {
    redirect('/server-admin/login');
  }

  const adminRecord = await getOne<{ admin_role: string; is_active: boolean }>(
    `SELECT admin_role, is_active FROM admin_users WHERE user_id = $1 AND is_active = true`,
    [user.id]
  );

  if (!adminRecord) {
    redirect('/feed');
  }

  return (
    <div className={`${outfit.variable} font-sans min-h-screen bg-zinc-950 text-white flex`}>
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-white/[0.06] bg-black flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-white/[0.06]">
          <Link href="/server-admin" className="flex items-center gap-2">
            <span className="font-serif text-lg text-white">LowKey</span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-red-400 font-medium bg-red-400/10 px-2 py-0.5 rounded-sm">Admin</span>
          </Link>
          <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">
            {adminRecord!.admin_role.replace('_', ' ')}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {adminNav.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-white/[0.03] rounded-sm transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/[0.06] space-y-2">
          <Link
            href="/feed"
            className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-500 hover:text-white transition-colors"
          >
            ← Back to App
          </Link>
          <AdminLogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-8">{children}</main>
    </div>
  );
}
