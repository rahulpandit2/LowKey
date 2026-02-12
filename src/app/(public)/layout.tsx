import React from 'react';
import { Outfit } from 'next/font/google';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export default function PublicLayout({ children }: { children: React.ReactNode }) {
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
