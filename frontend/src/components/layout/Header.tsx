'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronDown, HandPlatter, MapPin } from 'lucide-react';
import { brand } from '@/config/brand';
import { useTelegram } from '@/hooks/useTelegram';
import { useI18n } from '@/hooks/useI18n';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/store/uiStore';
import { useUserStore } from '@/store/userStore';

/** Logotip: brend rangidagi kvadrat ichida patnis belgisi + restoran nomi (brand.ts) */
export function Logo({ className, size = 'md' }: { className?: string; size?: 'md' | 'lg' }) {
  const lg = size === 'lg';
  return (
    <span className={cn('inline-flex items-center gap-2.5 font-semibold', lg && 'flex-col gap-3', className)}>
      <span
        className={cn(
          'flex items-center justify-center bg-brand text-on-brand',
          lg ? 'size-[72px] rounded-[22px]' : 'size-9 rounded-[11px]',
        )}
      >
        <HandPlatter size={lg ? 40 : 21} strokeWidth={lg ? 1.75 : 2} />
      </span>
      <span className={lg ? 'text-[22px] tracking-[-0.02em]' : 'text-[16px] tracking-[-0.01em]'}>{brand.name}</span>
    </span>
  );
}

export function Avatar({ name, photo, size = 'md' }: { name: string; photo?: string; size?: 'md' | 'lg' }) {
  const box = size === 'lg' ? 'size-16 text-[24px]' : 'size-10 text-[16px]';
  if (photo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={photo} alt="" className={cn('shrink-0 rounded-full object-cover', box)} />;
  }
  return (
    <span className={cn('flex shrink-0 items-center justify-center rounded-full bg-brand-soft font-semibold text-brand-ink', box)}>
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

/**
 * Bosh sahifa sarlavhasi: yetkazish manzili (bosilsa manzilni tahrirlash paneli ochiladi),
 * avatar (profil) va "Xush kelibsiz, {ism}!" salomi.
 */
export function HomeHeader({ children }: { children?: ReactNode }) {
  const { user } = useTelegram();
  const me = useUserStore((state) => state.me);
  const { t } = useI18n();
  const openContacts = useUiStore((state) => state.openContacts);
  const name = user?.first_name || me?.firstName || t('home.guest');

  return (
    <header className="px-4 pt-3">
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={openContacts} className="flex min-w-0 items-center gap-2 rounded-[12px] py-1 pr-2 text-left">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface">
            <MapPin size={17} strokeWidth={2} />
          </span>
          <span className="min-w-0">
            <span className="block text-[12px] leading-tight font-medium text-ink-2">{t('home.deliverTo')}</span>
            <span className="flex items-center gap-1 text-[15px] leading-tight font-semibold">
              <span className="truncate">{me?.address || t('home.chooseAddress')}</span>
              <ChevronDown size={16} strokeWidth={2.25} className="shrink-0 text-ink-2" />
            </span>
          </span>
        </button>
        <Link href="/profile" aria-label={t('nav.profile')} className="shrink-0 rounded-full">
          <Avatar name={name} photo={user?.photo_url} />
        </Link>
      </div>
      <h1 className="mt-4 text-[28px] leading-[1.15] font-semibold">{t('home.greeting', { name })}</h1>
      {children}
    </header>
  );
}

/** Ichki sahifalar uchun sarlavha */
export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <header className="flex items-end justify-between gap-3 px-4 pt-5 pb-4">
      <div className="min-w-0">
        <h1 className="text-[28px] leading-[1.15] font-semibold">{title}</h1>
        {subtitle && <p className="mt-1 text-[14px] text-ink-2">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}
