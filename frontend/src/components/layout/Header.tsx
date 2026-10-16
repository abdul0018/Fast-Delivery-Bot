'use client';

import type { ReactNode } from 'react';
import { LanguageSwitcher } from '@/components/features/LanguageSwitcher';
import { brand } from '@/config/brand';
import { useTelegram } from '@/hooks/useTelegram';
import { useI18n } from '@/hooks/useI18n';
import { useUserStore } from '@/store/userStore';

/** Restoran nomi — ikki qatorli qizil "logotip" (brand.ts dagi nomdan) */
export function Wordmark({ className = '' }: { className?: string }) {
  const words = brand.name.split(' ');
  return (
    <span className={`shout block text-[22px] leading-[0.88] text-brand-ink ${className}`}>
      {words.map((word) => (
        <span key={word} className="block">
          {word}
        </span>
      ))}
    </span>
  );
}

/**
 * Bosh sahifa sarlavhasi: logotip + til, katta bosh harfli shior va xush kelibsiz matni (ism bilan).
 */
export function HomeHeader({ children }: { children?: ReactNode }) {
  const { user } = useTelegram();
  const me = useUserStore((state) => state.me);
  const { t } = useI18n();
  const name = user?.first_name || me?.firstName || t('home.guest');

  return (
    <header className="px-4 pt-4">
      <div className="flex items-start justify-between gap-3">
        <Wordmark />
        <LanguageSwitcher compact />
      </div>
      <h1 className="shout mt-3 text-[30px]">
        {t('home.heroTitle')}
        <span className="block text-brand-ink">{t('home.heroTitleAccent')}</span>
      </h1>
      <p className="mt-1.5 text-[15px] font-medium text-ink-2">{t('home.greeting', { name })}</p>
      {children}
    </header>
  );
}

/** Ichki sahifalar uchun sarlavha */
export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <header className="flex items-end justify-between gap-3 px-4 pt-5 pb-3">
      <div className="min-w-0">
        <h1 className="shout text-[32px]">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm font-medium text-ink-2">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}
