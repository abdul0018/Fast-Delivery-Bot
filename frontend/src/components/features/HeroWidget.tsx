'use client';

import Link from 'next/link';
import { Bike, ShieldCheck, Timer, type LucideIcon } from 'lucide-react';
import { brand } from '@/config/brand';
import { useI18n } from '@/hooks/useI18n';

/** Asosiy vidjet: "Katalogni ko'rish" / "Yangi buyurtma berish" */
export function HeroWidget() {
  const { t } = useI18n();
  const { deliveryMinutes, halal, freeDelivery } = brand.promises;

  // Faqat restoran brand.ts da tasdiqlagan va'dalar ko'rsatiladi
  const facts: { icon: LucideIcon; label: string }[] = [
    deliveryMinutes ? { icon: Timer, label: t('home.featureFast', { minutes: deliveryMinutes }) } : null,
    halal ? { icon: ShieldCheck, label: t('home.featureHalal') } : null,
    freeDelivery ? { icon: Bike, label: t('home.featureFree') } : null,
  ].filter((fact): fact is { icon: LucideIcon; label: string } => fact !== null);

  return (
    <section className="mx-4 overflow-hidden rounded-[24px] bg-surface shadow-[0_2px_4px_rgba(23,20,42,0.06),0_18px_36px_-18px_rgba(23,20,42,0.4)]">
      <div className="relative aspect-[16/8] bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/products/hero-spread.jpg" alt="" className="size-full object-cover" />
      </div>
      <div className="px-4 pt-4 pb-4">
        <h2 className="text-[22px] leading-tight font-bold">{t('home.heroTitle')}</h2>
        <p className="mt-1.5 text-[14px] text-ink-2">{t('home.heroText')}</p>

        {facts.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] font-medium">
            {facts.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-1.5">
                <Icon size={16} strokeWidth={1.75} className="text-brand-ink" />
                {label}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 grid gap-2">
          <Link
            href="/catalog"
            className="flex h-[52px] items-center justify-center rounded-[16px] bg-brand px-4 font-display text-[15px] font-semibold text-on-brand shadow-[0_8px_18px_-10px_var(--brand)] transition-transform active:scale-[0.98]"
          >
            {t('home.viewCatalog')}
          </Link>
          <Link
            href="/catalog?category=burgers"
            className="flex h-12 items-center justify-center rounded-[16px] bg-brand-soft px-4 font-display text-[15px] font-semibold text-brand-ink transition-transform active:scale-[0.98]"
          >
            {t('home.newOrder')}
          </Link>
        </div>
      </div>
    </section>
  );
}
