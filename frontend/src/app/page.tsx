'use client';

/** Bosh sahifa: atlas maydonidagi sarlavha va stories, asosiy vidjet, ommabop mahsulotlar */
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
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
    .slice(0, 6);

  return (
    <div className="pb-2">
      <HomeHeader>
        <Stories />
      </HomeHeader>

      {/* Asosiy vidjet atlas maydoni va lentasi ustiga chiqib turadi */}
      <div className="relative z-10 -mt-[84px] space-y-6">
        <HeroWidget />

        <section>
          <div className="flex items-baseline justify-between px-4 pb-3">
            <h2 className="text-[20px] font-bold">{t('home.popular')}</h2>
            <Link href="/catalog" className="flex items-center gap-0.5 text-sm font-semibold text-brand-ink">
              {t('home.seeAll')}
              <ChevronRight size={16} strokeWidth={1.75} />
            </Link>
          </div>
          <div className="no-scrollbar flex snap-x gap-3 overflow-x-auto scroll-px-4 px-4 pb-3">
            {status !== 'ready' && products.length === 0
              ? Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-[262px] w-[158px] shrink-0" />)
              : popular.map((product) => (
                  <ProductCard key={product.id} product={product} className="w-[158px] shrink-0 snap-start" />
                ))}
          </div>
        </section>
      </div>
    </div>
  );
}
