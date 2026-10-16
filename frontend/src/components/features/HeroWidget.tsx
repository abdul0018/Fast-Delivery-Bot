'use client';

import Link from 'next/link';
import { Bike, ShieldCheck, Timer, type LucideIcon } from 'lucide-react';
import { buttonClasses } from '@/components/ui/Button';
import { brand } from '@/config/brand';
import { useI18n } from '@/hooks/useI18n';

/**
 * Asosiy vidjet — katta surat-banner: sarlavha, restoran tasdiqlagan va'dalar (brand.ts),
 * "Katalogni ko'rish" (asosiy) va "Yangi buyurtma berish" tugmalari.
 */
export function HeroWidget() {
  const { t } = useI18n();
  const { deliveryMinutes, halal, freeDelivery } = brand.promises;

  const facts: { icon: LucideIcon; label: string }[] = [
    deliveryMinutes ? { icon: Timer, label: t('home.featureFast', { minutes: deliveryMinutes }) } : null,
    halal ? { icon: ShieldCheck, label: t('home.featureHalal') } : null,
    freeDelivery ? { icon: Bike, label: t('home.featureFree') } : null,
  ].filter((fact): fact is { icon: LucideIcon; label: string } => fact !== null);

  return (
    <section className="mx-4 overflow-hidden rounded-[24px] bg-surface">
      <div className="relative aspect-[2/1] bg-tile">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/products/hero-spread.jpg" alt="" className="size-full object-cover object-[50%_60%]" />
        {facts.length > 0 && (
          <ul className="absolute inset-x-3 bottom-3 flex flex-wrap gap-1.5">
            {facts.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-1.5 rounded-full bg-white/92 px-2.5 py-1 text-[12px] font-medium text-ink backdrop-blur-sm"
              >
                <Icon size={14} strokeWidth={2} className="shrink-0" />
                {label}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="p-4 pt-3.5">
        <h2 className="text-[21px] leading-tight font-semibold">{t('home.heroTitle')}</h2>
        <p className="mt-1 text-[14px] text-ink-2">{t('home.heroText')}</p>
        <div className="mt-4 flex flex-col gap-2">
          <Link href="/catalog" className={buttonClasses({ variant: 'primary', size: 'md', fullWidth: true })}>
            {t('home.viewCatalog')}
          </Link>
          <Link href="/catalog?category=burgers" className={buttonClasses({ variant: 'secondary', size: 'md', fullWidth: true })}>
            {t('home.newOrder')}
          </Link>
        </div>
      </div>
    </section>
  );
}
