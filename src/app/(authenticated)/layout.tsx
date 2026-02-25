import React from 'react';
import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import Sidebar from '@/components/authenticated/Sidebar';
import MobileHeader from '@/components/authenticated/MobileHeader';
import AdminBanner from '@/components/authenticated/AdminBanner';
import TrendingSidebar from '@/components/authenticated/TrendingSidebar';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'Feed',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className={`${outfit.variable} font-sans min-h-screen bg-black text-white flex`}>
      <AdminBanner />
      {/* Sidebar */}
      <Sidebar />

      {/* Mobile Header */}
      <MobileHeader />

      {/* Main Content */}
      <main className="flex-1 min-w-0 border-x border-white/5 md:border-none">{children}</main>

      {/* Right Sidebar — Trending / Quick Post */}
      <TrendingSidebar />
    </div>
  );
}
