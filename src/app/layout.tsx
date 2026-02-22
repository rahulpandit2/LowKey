import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/index.css';
import ToastProvider from '@/components/ui/ToastProvider';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'LowKey — The Good Internet',
    template: '%s | LowKey',
  },
  description: 'A calm, privacy-first social platform for thoughtful engagement. Share thoughts, solve problems, and reflect — without the noise.',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

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
