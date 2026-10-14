'use client';

import type { ReactNode } from 'react';
import { AtlasBand } from '@/components/ui/AtlasBand';
import { brand } from '@/config/brand';
import { useTelegram } from '@/hooks/useTelegram';
import { useI18n } from '@/hooks/useI18n';
import { useUserStore } from '@/store/userStore';

function Avatar({ name, photo, size = 44 }: { name: string; photo?: string; size?: number }) {
  if (photo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={photo} alt="" width={size} height={size} className="rounded-full object-cover ring-2 ring-on-brand/40" />;
  }
  return (
    <span
      style={{ width: size, height: size }}
      className="flex shrink-0 items-center justify-center rounded-full bg-silk-3 font-display text-lg font-bold text-[#17142a]"
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

/**
 * Bosh sahifa sarlavhasi — brend rangidagi "atlas" maydoni (ekran balandligining ~40%):
 * "Xush kelibsiz, {ism}!", restoran nomi (o'ng tomonda, sokin), stories va (children) asosiy taklif.
 * Maydonning pastki cheti — butun kenglikdagi abr lentasi.
 */
export function HomeHeader({ children }: { children?: ReactNode }) {
  const { user } = useTelegram();
  const me = useUserStore((state) => state.me);
  const { t } = useI18n();
  const name = user?.first_name || me?.firstName || t('home.guest');

  return (
    <header className="relative">
      <div className="silk-field px-4 pt-4 pb-5">
        <div className="flex items-center gap-3">
          <Avatar name={name} photo={user?.photo_url} />
          <h1 className="min-w-0 flex-1 text-[22px] leading-[1.15] font-bold">{t('home.greeting', { name })}</h1>
          <span className="shrink-0 self-start pt-1 font-display text-[13px] font-semibold text-on-brand/70">{brand.name}</span>
        </div>
        {children}
      </div>
      <AtlasBand variant="edge" height={32} seed={11} />
    </header>
  );
}

/** Ichki sahifalar uchun sarlavha */
export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <header className="flex items-end justify-between gap-3 px-4 pt-5 pb-3">
      <div className="min-w-0">
        <h1 className="text-[28px] leading-none font-bold">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-ink-2">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}
