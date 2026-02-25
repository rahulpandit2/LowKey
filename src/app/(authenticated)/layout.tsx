import React from 'react';
import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import { redirect } from 'next/navigation';
import { getCurrentUser, getAdminCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import { unstable_noStore as noStore } from 'next/cache';
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

async function getMaintenanceMode() {
  noStore();
  try {
    const res = await query(`SELECT value FROM site_settings WHERE key = 'maintenance_mode'`);
    const val = res.rows[0]?.value;
    return val === 'true' || val === true || val === '"true"';
  } catch {
    return false;
  }
}

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const isMaintenance = await getMaintenanceMode();
  if (isMaintenance) {
    const admin = await getAdminCurrentUser();
    if (!admin) {
      return (
        <div className={`${outfit.variable} font-sans min-h-screen flex flex-col items-center justify-center bg-black text-white selection:bg-white selection:text-black`}>
          <div className="text-center p-12 border border-white/10 bg-white/[0.02] max-w-lg mx-auto">
            <h1 className="text-4xl font-serif text-white mb-4">Under Maintenance</h1>
            <p className="text-zinc-400 leading-relaxed">The platform is currently undergoing scheduled maintenance. Please check back shortly.</p>
          </div>
        </div>
      );
    }
  }

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
