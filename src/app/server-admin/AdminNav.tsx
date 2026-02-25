'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const adminNav = [
    // Core
    { label: 'Dashboard', href: '/server-admin/overview', icon: '⊞' },
    { label: 'Users', href: '/server-admin/users', icon: '◎' },
    { label: 'Sub-Admins', href: '/server-admin/sub-admins', icon: '⬟' },
    { label: 'Communities', href: '/server-admin/communities', icon: '⬡' },
    // Moderation
    { label: 'Moderation', href: '/server-admin/moderation', icon: '⚑', group: 'Moderation' },
    { label: 'Contact Requests', href: '/server-admin/contact-requests', icon: '✉' },
    { label: 'Deletion Requests', href: '/server-admin/deletion', icon: '⊗' },
    // Content & Policy
    { label: 'Achievements', href: '/server-admin/achievements', icon: '⬡', group: 'Content' },
    { label: 'Policy Editor', href: '/server-admin/policy', icon: '⊜' },
    { label: 'Legal', href: '/server-admin/legal', icon: '⊘' },
    // Comms
    { label: 'Send Notification', href: '/server-admin/send-notification', icon: '◈', group: 'Comms' },
    { label: 'Send Message', href: '/server-admin/send-message', icon: '◉' },
    // Infrastructure
    { label: 'Security', href: '/server-admin/security', icon: '⛨', group: 'Infrastructure' },
    { label: 'Audit Logs', href: '/server-admin/logs', icon: '≡' },
    { label: 'Backups', href: '/server-admin/backups', icon: '⊡' },
    { label: 'Automation', href: '/server-admin/automation', icon: '⟳' },
    { label: 'Integrations', href: '/server-admin/integrations', icon: '⊕' },
    { label: 'Maintenance', href: '/server-admin/maintenance', icon: '⚙' },
    // Admin Sys
    { label: 'My Profile', href: '/server-admin/profile', icon: '⊙', group: 'Admin' },
    { label: 'Settings', href: '/server-admin/settings', icon: '◧' },
    { label: 'Help & Docs', href: '/server-admin/help', icon: '?' },
];

const GROUP_LABELS: Record<string, string> = {
    Moderation: 'Moderation',
    Content: 'Content & Policy',
    Comms: 'Communications',
    Infrastructure: 'Infrastructure',
    Admin: 'Admin',
};

export default function AdminNav() {
    const pathname = usePathname();
    let lastGroup = '';

    return (
        <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
            {adminNav.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                const showGroupHeader = item.group && item.group !== lastGroup;
                if (item.group) lastGroup = item.group;

                return (
                    <div key={item.href}>
                        {showGroupHeader && (
                            <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-700 px-3 pt-4 pb-1.5 font-medium">
                                {GROUP_LABELS[item.group!]}
                            </p>
                        )}
                        <Link
                            href={item.href}
                            className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-sm transition-colors border-l-2 ${isActive
                                    ? 'text-white bg-white/[0.05] border-white'
                                    : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.03] border-transparent'
                                }`}
                        >
                            <span className={`text-xs w-4 text-center flex-shrink-0 ${isActive ? 'text-white' : 'text-zinc-600'}`}>
                                {item.icon}
                            </span>
                            {item.label}
                        </Link>
                    </div>
                );
            })}
        </nav>
    );
}
