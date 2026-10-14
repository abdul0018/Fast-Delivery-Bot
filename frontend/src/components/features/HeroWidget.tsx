'use client';

import Link from 'next/link';
import { useI18n } from '@/hooks/useI18n';

/** Asosiy vidjet: "Katalogni ko'rish" / "Yangi buyurtma berish" */
export function HeroWidget() {
  const { t } = useI18n();

  return (
    <section className="relative mx-4 overflow-hidden rounded-[28px] bg-gradient-to-br from-brand via-orange-500 to-sale p-5 text-white shadow-xl shadow-brand/30">
      <div className="absolute -top-6 -right-6 size-40 rounded-full bg-white/10" />
      <div className="absolute -right-2 -bottom-10 size-28 rounded-full bg-white/10" />
      <span className="absolute top-4 right-4 rotate-12 text-[76px] leading-none drop-shadow-xl">🍔</span>

      <div className="relative max-w-[68%]">
        <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
          {t('home.heroBadge')}
        </span>
        <h2 className="mt-3 text-[26px] leading-tight font-extrabold">{t('home.heroTitle')}</h2>
        <p className="mt-2 text-sm text-white/85">{t('home.heroText')}</p>
      </div>

      <div className="relative mt-5 grid grid-cols-2 gap-2">
        <Link
          href="/catalog"
          className="flex min-h-12 items-center justify-center rounded-2xl bg-white px-2 text-center text-[13px] leading-tight font-bold text-brand transition active:scale-[0.97]"
        >
          {t('home.viewCatalog')}
        </Link>
        <Link
          href="/catalog?category=burgers"
          className="flex min-h-12 items-center justify-center rounded-2xl bg-black/20 px-2 text-center text-[13px] leading-tight font-bold text-white backdrop-blur transition active:scale-[0.97]"
        >
          {t('home.newOrder')}
        </Link>
      </div>
    </section>
  );
}
