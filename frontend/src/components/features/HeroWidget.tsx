'use client';

import Link from 'next/link';
import { Bike, ShieldCheck, Timer, type LucideIcon } from 'lucide-react';
import { buttonClasses } from '@/components/ui/Button';
import { brand } from '@/config/brand';
import { useI18n } from '@/hooks/useI18n';

/**
 * Asosiy vidjet — qizil aksiya kartasi: katta xantal chegirma, dumaloq taom rasmi,
 * "Katalogni ko'rish" / "Yangi buyurtma berish" va restoran va'dalari.
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
    <section className="mx-4 overflow-hidden rounded-[30px] bg-brand text-on-brand">
      <div className="relative min-h-[172px] px-5 pt-5">
        <p className="shout text-[58px] leading-[0.85] text-accent">{t('home.promoValue')}</p>
        <p className="shout mt-2 max-w-[150px] text-[17px] leading-[1.05]">{t('home.promoText')}</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/products/cheeseburger.jpg"
          alt=""
          className="absolute top-4 -right-6 size-[180px] rounded-full border-[6px] border-on-brand object-cover"
        />
      </div>

      {facts.length > 0 && (
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5 px-5 pt-4 text-[13px] font-bold">
          {facts.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-1.5">
              <Icon size={16} strokeWidth={2.25} className="text-accent" />
              {label}
            </li>
          ))}
        </ul>
      )}

      <div className="grid gap-2 p-4 pt-4">
        <Link href="/catalog" className={buttonClasses({ variant: 'inverse', size: 'lg', fullWidth: true })}>
          {t('home.viewCatalog')}
        </Link>
        <Link
          href="/catalog?category=burgers"
          className={buttonClasses({ variant: 'outline', size: 'lg', fullWidth: true, className: 'border-on-brand text-on-brand hover:bg-white/10' })}
        >
          {t('home.newOrder')}
        </Link>
      </div>
    </section>
  );
}
