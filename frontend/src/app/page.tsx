'use client';

/** Bosh sahifa: sarlavha, stories, asosiy vidjet va ommabop mahsulotlar */
import Link from 'next/link';
import { HeroWidget } from '@/components/features/HeroWidget';
import { ProductCard } from '@/components/features/ProductCard';
import { Stories } from '@/components/features/Stories';
import { Header } from '@/components/layout/Header';
import { Skeleton } from '@/components/ui/Skeleton';
import { useCatalog } from '@/hooks/useCatalog';
import { useI18n } from '@/hooks/useI18n';
import { discountPercent } from '@/lib/utils';

export default function HomePage() {
  const { t } = useI18n();
  const { products, status } = useCatalog();

  // Eng katta chegirmali mahsulotlar — "Ommabop"
  const popular = [...products]
    .sort((a, b) => discountPercent(b.price, b.oldPrice) - discountPercent(a.price, a.oldPrice))
    .slice(0, 6);

  const features = [
    { icon: '⚡', label: t('home.featureFast') },
    { icon: '✅', label: t('home.featureHalal') },
    { icon: '🛵', label: t('home.featureFree') },
  ];

  return (
    <div className="space-y-5">
      <Header />
      <Stories />
      <HeroWidget />

      <div className="grid grid-cols-3 gap-2 px-4">
        {features.map((feature) => (
          <div key={feature.label} className="flex flex-col items-center gap-1 rounded-2xl bg-surface px-2 py-3 text-center">
            <span className="text-xl">{feature.icon}</span>
            <span className="text-xs leading-tight font-semibold">{feature.label}</span>
          </div>
        ))}
      </div>

      <section>
        <div className="flex items-center justify-between px-4 pb-2">
          <h2 className="text-lg font-bold">{t('home.popular')}</h2>
          <Link href="/catalog" className="text-sm font-semibold text-brand">
            {t('home.seeAll')} →
          </Link>
        </div>
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-2">
          {status !== 'ready' && products.length === 0
            ? Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-60 w-40 shrink-0 rounded-3xl" />)
            : popular.map((product) => <ProductCard key={product.id} product={product} className="w-40 shrink-0" />)}
        </div>
      </section>
    </div>
  );
}
