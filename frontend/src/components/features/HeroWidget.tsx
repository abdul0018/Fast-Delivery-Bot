'use client';

import Link from 'next/link';
import { Bike, ShieldCheck, Timer, type LucideIcon } from 'lucide-react';
import { buttonClasses } from '@/components/ui/Button';
import { brand } from '@/config/brand';
import { useI18n } from '@/hooks/useI18n';

/**
 * Asosiy vidjet — ixcham qizil aksiya kartasi: konturli xantal chegirma, dumaloq taom rasmi,
 * restoran va'dalari, krem "Katalogni ko'rish" kapsulasi va "Yangi buyurtma berish" havolasi.
 * Ixcham — birinchi ekranda ommabop taomlar narxi bilan ko'rinib turishi uchun.
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
    <section className="mx-4 overflow-hidden rounded-[30px] bg-brand-fill p-4 text-on-brand">
      <div className="relative min-h-[124px] pr-[112px]">
        <p className="shout ink-stroke text-[52px] leading-[0.85] text-accent">{t('home.promoValue')}</p>
        <p className="shout mt-2 text-[16px] leading-[1.05]">{t('home.promoText')}</p>
        {facts.length > 0 && (
          <ul className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-[13px] font-bold">
            {facts.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-1.5">
                <Icon size={15} strokeWidth={2.25} className="shrink-0 text-accent" />
                {label}
              </li>
            ))}
          </ul>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/products/cheeseburger.jpg"
          alt=""
          className="absolute -top-1 -right-8 size-[124px] rounded-full border-[5px] border-on-brand object-cover"
        />
      </div>

      {/* Asosiy harakat — krem kapsula, ikkinchisi — sokin matnli havola (ikkalasi bir qatorda) */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <Link href="/catalog" className={buttonClasses({ variant: 'inverse', size: 'md', className: 'shrink-0 px-5 whitespace-nowrap text-[13px]' })}>
          {t('home.viewCatalog')}
        </Link>
        <Link
          href="/catalog?category=burgers"
          className="text-right text-[13px] leading-tight font-extrabold underline decoration-2 underline-offset-4"
        >
          {t('home.newOrder')}
        </Link>
      </div>
    </section>
  );
}
