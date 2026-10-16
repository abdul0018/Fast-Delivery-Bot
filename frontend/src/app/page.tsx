'use client';

/** Bosh sahifa: logotip va shior, stories, qizil aksiya vidjeti, ommabop taomlar */
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HeroWidget } from '@/components/features/HeroWidget';
import { ProductCard } from '@/components/features/ProductCard';
import { Stories } from '@/components/features/Stories';
import { HomeHeader } from '@/components/layout/Header';
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
    .slice(0, 4);

  return (
    <div className="space-y-6 pb-2">
      <HomeHeader>
        <Stories />
      </HomeHeader>

      <HeroWidget />

      <section>
        <div className="flex items-end justify-between px-4 pb-3">
          <h2 className="shout text-[24px]">{t('home.popular')}</h2>
          <Link href="/catalog" className="flex items-center gap-1 text-sm font-extrabold text-brand-ink uppercase">
            {t('home.seeAll')}
            <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 px-4">
          {status !== 'ready' && products.length === 0
            ? Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-[270px]" />)
            : popular.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </div>
  );
}
