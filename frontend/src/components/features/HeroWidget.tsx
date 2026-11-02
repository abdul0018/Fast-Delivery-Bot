'use client';

import Link from 'next/link';
import { buttonClasses } from '@/components/ui/Button';
import { brand } from '@/config/brand';
import { useI18n } from '@/hooks/useI18n';
import { asset } from '@/lib/utils';
import { PROMISE_ICONS } from './Promises';

/**
 * Asosiy vidjet — katta surat-banner: do'kon shiori, haqiqiy va'dalar (brand.ts),
 * "Katalogni ko'rish" (asosiy) va "Yangi buyurtma berish" tugmalari.
 */
export function HeroWidget() {
  const { t, pick } = useI18n();

  return (
    <section className="mx-4 overflow-hidden rounded-[24px] bg-surface">
      <div className="relative aspect-[2/1] bg-tile">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset('/images/promo/yukola.jpg')} alt="" className="size-full object-cover object-[50%_55%]" />
        <span className="absolute top-3 left-3 rounded-full bg-white/92 px-2.5 py-1 text-[12px] font-medium text-ink backdrop-blur-sm">
          {pick(brand.tagline)}
        </span>
      </div>
      <div className="p-4 pt-3.5">
        <h2 className="text-[21px] leading-tight font-semibold">{t('home.heroTitle')}</h2>
        <ul className="mt-2.5 space-y-1.5">
          {brand.promises.map(({ icon, text }) => {
            const Icon = PROMISE_ICONS[icon];
            return (
              <li key={icon} className="flex items-center gap-2 text-[14px] text-ink-2">
                <Icon size={16} strokeWidth={2} className="shrink-0 text-brand-ink" />
                {pick(text)}
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex flex-col gap-2">
          <Link href="/catalog" className={buttonClasses({ variant: 'primary', size: 'md', fullWidth: true })}>
            {t('home.viewCatalog')}
          </Link>
          <Link href="/catalog?category=smoked" className={buttonClasses({ variant: 'secondary', size: 'md', fullWidth: true })}>
            {t('home.newOrder')}
          </Link>
        </div>
      </div>
    </section>
  );
}
