import React from 'react';
import { Outfit } from 'next/font/google';
import Sidebar from '@/components/authenticated/Sidebar';
import MobileHeader from '@/components/authenticated/MobileHeader';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${outfit.variable} font-sans min-h-screen bg-black text-white flex`}>
      {/* Sidebar */}
      <Sidebar />

      {/* Mobile Header */}
      <MobileHeader />

      {/* Main Content */}
      <main className="flex-1 min-w-0 border-x border-white/5 md:border-none">{children}</main>

      {/* Right Sidebar (Optional / Future) */}
      <aside className="hidden lg:block w-80 sticky top-0 h-screen border-l border-white/10 p-6">
        {/* Trends or Suggestions */}
        <div className="mb-8">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">
            Trending
          </h3>
          <div className="space-y-4">
            {/* Placeholders */}
            <div className="h-16 bg-white/5 rounded-lg"></div>
            <div className="h-16 bg-white/5 rounded-lg"></div>
            <div className="h-16 bg-white/5 rounded-lg"></div>
          </div>
        </div>
      </aside>
    </div>
  );
}
