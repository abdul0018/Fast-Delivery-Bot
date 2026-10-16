import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import type { ReactNode } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { brand, brandCssVars } from '@/config/brand';
import { TelegramProvider } from '@/providers/TelegramProvider';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: brand.name,
  description: "Fast-food yetkazib berish — Telegram Mini App / Доставка фастфуда",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: brand.chrome,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uz" style={brandCssVars} suppressHydrationWarning>
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
