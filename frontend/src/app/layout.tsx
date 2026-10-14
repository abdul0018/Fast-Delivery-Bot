import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import type { ReactNode } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { TelegramProvider } from '@/providers/TelegramProvider';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Fast Delivery',
  description: "Fast-food yetkazib berish — Telegram Mini App / Доставка фастфуда",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body className="antialiased">
        {/* Telegram WebApp SDK — window.Telegram.WebApp ni yaratadi */}
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <TelegramProvider>
          <AppShell>{children}</AppShell>
        </TelegramProvider>
      </body>
    </html>
  );
}
