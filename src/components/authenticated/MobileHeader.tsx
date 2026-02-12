'use client';

import { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import Sidebar from './Sidebar';

export default function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden sticky top-0 z-50 bg-black border-b border-white/10 px-6 py-4 flex items-center justify-between">
      <Link href="/feed">
        <span className="font-serif text-xl font-bold text-white">LowKey</span>
      </Link>
      <button onClick={() => setIsOpen(!isOpen)} className="text-white">
        <Icon name={isOpen ? 'XMarkIcon' : 'Bars3Icon'} size={24} />
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black pt-20 px-6">
          <nav className="flex flex-col gap-6">
            <Link
              href="/feed"
              onClick={() => setIsOpen(false)}
              className="text-xl font-medium text-white"
            >
              Home
            </Link>
            <Link
              href="/search"
              onClick={() => setIsOpen(false)}
              className="text-xl font-medium text-zinc-400"
            >
              Search
            </Link>
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xl font-medium text-zinc-400"
            >
              Notifications
            </Link>
            <Link
              href="/messages"
              onClick={() => setIsOpen(false)}
              className="text-xl font-medium text-zinc-400"
            >
              Messages
            </Link>
            <Link
              href="/communities"
              onClick={() => setIsOpen(false)}
              className="text-xl font-medium text-zinc-400"
            >
              Communities
            </Link>
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="text-xl font-medium text-zinc-400"
            >
              Profile
            </Link>
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="text-xl font-medium text-zinc-400"
            >
              Settings
            </Link>
            <Link
              href="/post-composer"
              onClick={() => setIsOpen(false)}
              className="mt-8 py-3 bg-white text-black font-bold uppercase tracking-widest text-center"
            >
              Compose
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
