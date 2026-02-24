'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.data) setUser(data.data);
      })
      .catch(() => { });
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { label: 'Home', href: '/feed', icon: 'HomeIcon' },
    { label: 'Search', href: '/search', icon: 'MagnifyingGlassIcon' },
    { label: 'Notifications', href: '/notifications', icon: 'BellIcon' },
    { label: 'Messages', href: '/messages', icon: 'EnvelopeIcon' },
    { label: 'Communities', href: '/my-communities', icon: 'UserGroupIcon' },
    { label: 'Bookmarks', href: '/bookmarks', icon: 'BookmarkIcon' },
    { label: 'Post Manager', href: '/post-manager', icon: 'DocumentTextIcon' },
    { label: 'Profile', href: '/profile', icon: 'UserIcon' },
    { label: 'Settings', href: '/settings', icon: 'Cog6ToothIcon' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen border-r border-white/10 sticky top-0 px-6 py-8">
      {/* Brand */}
      <Link href="/feed" className="mb-12 block">
        <span className="font-serif text-2xl font-bold tracking-tight text-white">LowKey</span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                ? 'bg-white text-black font-medium'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <Icon
                name={item.icon}
                size={24}
                className={isActive ? 'text-black' : 'text-zinc-400 group-hover:text-white'}
              />
              <span className="text-sm tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Compose Button */}
      <div className="pt-6">
        <Link
          href="/post-composer"
          className="flex items-center justify-center w-full py-4 bg-white hover:bg-zinc-200 text-black font-bold uppercase tracking-[0.1em] text-xs transition-colors rounded-none"
        >
          Compose
        </Link>
      </div>

      {/* User Mini Profile (Bottom) */}
      <div className="mt-8 pt-6 border-t border-white/10 relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-3 w-full hover:bg-white/5 p-2 rounded-lg transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden flex items-center justify-center text-white font-medium">
            {user?.profile?.display_name?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium text-white truncate">
              {user?.profile?.display_name || user?.username || 'User'}
            </p>
            <p className="text-xs text-zinc-500 truncate">@{user?.username || 'username'}</p>
          </div>
          <Icon name="EllipsisHorizontalIcon" size={20} className="text-zinc-500" />
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-zinc-900 border border-white/10 rounded-lg shadow-xl overflow-hidden">
            <Link
              href="/profile"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-sm text-white"
            >
              <Icon name="UserIcon" size={18} className="text-zinc-400" />
              Profile
            </Link>
            <Link
              href="/settings"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-sm text-white"
            >
              <Icon name="Cog6ToothIcon" size={18} className="text-zinc-400" />
              Settings
            </Link>
            {user?.isAdminActive && (
              <a
                href="/server-admin"
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-sm text-amber-400 w-full text-left border-t border-white/10 mt-1 pt-3"
              >
                <Icon name="ShieldCheckIcon" size={18} className="text-amber-400" />
                Switch to Admin
              </a>
            )}
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-sm text-red-400 w-full text-left ${user?.isAdminActive ? '' : 'border-t border-white/10 mt-1 pt-3'}`}
            >
              <Icon name="ArrowRightOnRectangleIcon" size={18} className="text-red-400" />
              Logout User
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
