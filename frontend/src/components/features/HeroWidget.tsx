'use client';

import Link from 'next/link';
import { Bike, ShieldCheck, Timer, type LucideIcon } from 'lucide-react';
import { buttonClasses } from '@/components/ui/Button';
import { brand } from '@/config/brand';
import { useI18n } from '@/hooks/useI18n';

/**
 * Asosiy vidjet — qizil banner: sarlavha, restoran va'dalari, oq "Katalogni ko'rish" tugmasi,
 * "Yangi buyurtma berish" havolasi va o'ngda oq likopchadagi taom (namunadagi splash uslubida).
 */
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
    <section className="relative mx-4 overflow-hidden rounded-[24px] bg-brand-fill p-4 text-on-brand">
      <div className="pr-[104px]">
        <h2 className="text-[21px] leading-tight font-extrabold">{t('home.heroTitle')}</h2>
        {facts.length > 0 && (
          <ul className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-[12px] font-semibold">
            {facts.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-1">
                <Icon size={14} strokeWidth={2.25} className="shrink-0" />
                {label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Oq likopcha ustidagi taom */}
      <span className="absolute top-3 -right-6 flex size-[128px] items-center justify-center rounded-full bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/products/cheeseburger.jpg" alt="" className="size-[104px] rounded-full object-cover" />
      </span>

      <div className="relative mt-5 flex items-center gap-4">
        <Link href="/catalog" className={buttonClasses({ variant: 'inverse', size: 'md', className: 'shrink-0 whitespace-nowrap' })}>
          {t('home.viewCatalog')}
        </Link>
        <Link href="/catalog?category=burgers" className="text-[13px] leading-tight font-bold whitespace-nowrap underline underline-offset-4">
          {t('home.newOrder')}
        </Link>
      </div>
    </section>
  );
}
