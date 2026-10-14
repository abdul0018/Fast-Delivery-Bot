'use client';

import Link from 'next/link';
import { Bike, ShieldCheck, Timer, type LucideIcon } from 'lucide-react';
import { buttonClasses } from '@/components/ui/Button';
import { brand } from '@/config/brand';
import { useI18n } from '@/hooks/useI18n';

/** Asosiy vidjet (sarlavhasi atlas maydonida): rasm, va'dalar, "Katalogni ko'rish" / "Yangi buyurtma berish" */
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
      <div className="px-4 pt-3.5 pb-4">
        {facts.length > 0 && (
          <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] font-medium">
            {facts.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-1.5">
                <Icon size={16} strokeWidth={1.75} className="text-brand-ink" />
                {label}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 grid gap-2">
          <Link href="/catalog" className={buttonClasses({ size: 'lg', fullWidth: true })}>
            {t('home.viewCatalog')}
          </Link>
          <Link href="/catalog?category=burgers" className={buttonClasses({ variant: 'secondary', size: 'lg', fullWidth: true })}>
            {t('home.newOrder')}
          </Link>
        </div>
      </div>
    </section>
  );
}
