import React from 'react';
import type { Metadata, Viewport } from 'next';
import { query } from '@/lib/db';
import { unstable_noStore as noStore } from 'next/cache';
import '../styles/index.css';
import ToastProvider from '@/components/ui/ToastProvider';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  noStore();
  let siteName = 'LowKey';
  let siteTagline = 'The Good Internet';
  let description = 'A calm, privacy-first social platform for thoughtful engagement. Share thoughts, solve problems, and reflect — without the noise.';

  try {
    const res = await query<{ key: string; value: any }>(
      `SELECT key, value FROM site_settings WHERE key IN ('site_name', 'site_tagline', 'site_description')`
    );
    const settings: Record<string, string> = {};
    for (const r of res.rows) {
      settings[r.key] = typeof r.value === 'string' ? r.value : String(r.value);
    }
    if (settings.site_name) siteName = settings.site_name;
    if (settings.site_tagline) siteTagline = settings.site_tagline;
    if (settings.site_description) description = settings.site_description;
  } catch {
    // ignore
  }

  return {
    title: {
      default: `${siteName} — ${siteTagline}`,
      template: `%s | ${siteName}`,
    },
    description,
    icons: {
      icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
