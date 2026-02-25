import React from 'react';
import { Outfit } from 'next/font/google';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { query } from '@/lib/db';
import { getAdminCurrentUser } from '@/lib/auth';
import { unstable_noStore as noStore } from 'next/cache';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

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

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
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

  return (
    <div
      className={`${outfit.variable} font-sans min-h-screen flex flex-col bg-black text-white selection:bg-white selection:text-black`}
    >
      {/* Noise Overlay Global for Public Pages */}
      <div className="noise-overlay fixed inset-0 z-0 pointer-events-none opacity-[0.03]"></div>

      <Header />
      <main className="flex-grow pt-24 relative z-10">{children}</main>
      <Footer />
    </div>
  );
}
