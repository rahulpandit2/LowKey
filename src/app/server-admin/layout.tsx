"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { Outfit } from 'next/font/google';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export default function ServerAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview', href: '/server-admin/overview', icon: 'ChartBarIcon' },
    { label: 'Users', href: '/server-admin/users', icon: 'UsersIcon' },
    { label: 'Communities', href: '/server-admin/communities', icon: 'UserGroupIcon' },
    { label: 'Moderation', href: '/server-admin/moderation', icon: 'ShieldExclamationIcon' },
    { label: 'Deletion', href: '/server-admin/deletion', icon: 'TrashIcon' },
    { label: 'Global Policy', href: '/server-admin/policy', icon: 'DocumentTextIcon' },
    { label: 'Settings', href: '/server-admin/settings', icon: 'Cog6ToothIcon' },
    { label: 'Security', href: '/server-admin/security', icon: 'LockClosedIcon' },
    { label: 'Logs', href: '/server-admin/logs', icon: 'ClipboardDocumentListIcon' },
    { label: 'System', href: '/server-admin/maintenance', icon: 'CpuChipIcon' },
    { label: 'Automation', href: '/server-admin/automation', icon: 'BoltIcon' },
    { label: 'Legal', href: '/server-admin/legal', icon: 'ScaleIcon' },
    { label: 'Backups', href: '/server-admin/backups', icon: 'CircleStackIcon' },
    { label: 'Integrations', href: '/server-admin/integrations', icon: 'PuzzlePieceIcon' },
    { label: 'Runbooks', href: '/server-admin/help', icon: 'BookOpenIcon' },
  ];

  return (
    <div className={`${outfit.variable} font-sans min-h-screen bg-black text-white flex`}>
      {/* Admin Sidebar */}
      <aside className="w-64 bg-zinc-900 border-r border-white/5 flex flex-col h-screen sticky top-0 overflow-y-auto">
        <div className="p-6">
          <div className="mb-8">
            <span className="font-serif text-xl font-bold text-red-500 tracking-tight">
              LowKey Admin
            </span>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">
              Authorized Access Only
            </p>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded transition-colors ${isActive
                      ? 'bg-white/10 text-white'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <Icon name={item.icon} size={18} className={isActive ? 'text-white' : 'text-zinc-500'} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-white/5">
          <Link
            href="/feed"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-500 hover:text-white transition-colors"
          >
            <Icon name="ArrowLeftOnRectangleIcon" size={18} />
            Exit to App
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-black min-w-0">{children}</main>
    </div>
  );
}
