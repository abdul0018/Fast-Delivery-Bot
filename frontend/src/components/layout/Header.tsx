'use client';

import type { ReactNode } from 'react';
import { useTelegram } from '@/hooks/useTelegram';
import { useI18n } from '@/hooks/useI18n';
import { useUserStore } from '@/store/userStore';

/** Bosh sahifa sarlavhasi: avatar, foydalanuvchi ismi va xush kelibsiz matni */
export function Header({ action }: { action?: ReactNode }) {
  const { user } = useTelegram();
  const me = useUserStore((state) => state.me);
  const { t } = useI18n();

  const name = user?.first_name || me?.firstName || t('home.guest');
  const initial = name.charAt(0).toUpperCase();

  return (
    <header className="flex items-center gap-3 px-4 pt-4 pb-2">
      {user?.photo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={user.photo_url} alt="" className="size-12 rounded-full object-cover ring-2 ring-brand/30" />
      ) : (
        <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-brand to-sale text-lg font-bold text-white">
          {initial}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm text-hint">{t('home.welcome')}</p>
        <h1 className="truncate text-xl font-bold">{t('home.greeting', { name })}</h1>
      </div>
      {action}
    </header>
  );
}

/** Ichki sahifalar uchun oddiy sarlavha */
export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <header className="flex items-end justify-between gap-3 px-4 pt-5 pb-3">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-hint">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}
