'use client';

import Link from 'next/link';
import { Bike, ShieldCheck, Timer } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

/** Asosiy vidjet: "Katalogni ko'rish" / "Yangi buyurtma berish" */
export function HeroWidget() {
  const { t } = useI18n();

  const facts = [
    { icon: Timer, label: t('home.featureFast') },
    { icon: ShieldCheck, label: t('home.featureHalal') },
    { icon: Bike, label: t('home.featureFree') },
  ];

  return (
    <section className="mx-4 overflow-hidden rounded-[24px] bg-surface shadow-[0_1px_2px_rgba(23,20,42,0.06),0_14px_32px_-20px_rgba(23,20,42,0.35)]">
      <div className="relative aspect-[16/8] bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/products/hero-spread.jpg" alt="" className="size-full object-cover" />
      </div>
      <div className="px-4 pt-4 pb-4">
        <h2 className="text-[22px] leading-tight font-bold">{t('home.heroTitle')}</h2>
        <p className="mt-1.5 text-[14px] text-ink-2">{t('home.heroText')}</p>

        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] font-medium">
          {facts.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-1.5">
              <Icon size={16} strokeWidth={1.9} className="text-brand-ink" />
              {label}
            </li>
          ))}
        </ul>

        <div className="mt-4 grid grid-cols-[1.25fr_1fr] gap-2">
          <Link
            href="/catalog"
            className="flex min-h-12 items-center justify-center rounded-[14px] bg-brand px-3 text-center font-display text-[14px] leading-tight font-semibold text-on-brand shadow-[0_8px_18px_-10px_var(--brand)] transition-transform active:scale-[0.98]"
          >
            {t('home.viewCatalog')}
          </Link>
          <Link
            href="/catalog?category=burgers"
            className="flex min-h-12 items-center justify-center rounded-[14px] bg-brand-soft px-3 text-center font-display text-[14px] leading-tight font-semibold text-brand-ink transition-transform active:scale-[0.98]"
          >
            {t('home.newOrder')}
          </Link>
        </div>
      </div>
    </section>
  );
}
