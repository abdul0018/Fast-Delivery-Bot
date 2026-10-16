'use client';

import type { ReactNode } from 'react';
import { HandPlatter } from 'lucide-react';
import { brand } from '@/config/brand';
import { useTelegram } from '@/hooks/useTelegram';
import { useI18n } from '@/hooks/useI18n';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/userStore';

/** Logotip: yopqichli patnis (cloche) belgisi + restoran nomi (brand.ts) */
export function Logo({ className, size = 'md' }: { className?: string; size?: 'md' | 'lg' }) {
  const lg = size === 'lg';
  return (
    <span className={cn('inline-flex flex-col items-center gap-1 font-display font-bold', className)}>
      <HandPlatter size={lg ? 64 : 34} strokeWidth={lg ? 1.6 : 1.9} />
      <span className={lg ? 'text-[22px]' : 'text-[14px]'}>{brand.name}</span>
    </span>
  );
}

function Avatar({ name, photo }: { name: string; photo?: string }) {
  if (photo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={photo} alt="" className="size-11 rounded-full object-cover" />;
  }
  return (
    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-soft font-display text-lg font-bold text-brand-ink">
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

/** Bosh sahifa sarlavhasi: "Xush kelibsiz, {ism}!", katta "Menyu" va avatar */
export function HomeHeader({ children }: { children?: ReactNode }) {
  const { user } = useTelegram();
  const me = useUserStore((state) => state.me);
  const { t } = useI18n();
  const name = user?.first_name || me?.firstName || t('home.guest');

  return (
    <header className="px-4 pt-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-ink-2">{t('home.greeting', { name })}</p>
          <h1 className="text-[28px] leading-tight font-bold">{t('home.menuTitle')}</h1>
        </div>
        <Avatar name={name} photo={user?.photo_url} />
      </div>
      {children}
    </header>
  );
}

/** Ichki sahifalar uchun sarlavha */
export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <header className="flex items-end justify-between gap-3 px-4 pt-5 pb-3">
      <div className="min-w-0">
        <h1 className="text-[26px] leading-tight font-bold">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm font-medium text-ink-2">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}
