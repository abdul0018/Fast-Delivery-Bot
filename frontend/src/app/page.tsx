'use client';

/** Bosh sahifa (namunadagi "Menu"): sarlavha va avatar, qidiruv, kategoriyalar, aksiyalar, banner, ommabop */
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, Search } from 'lucide-react';
import { CategoryTabs } from '@/components/features/CategoryTabs';
import { HeroWidget } from '@/components/features/HeroWidget';
import { ProductCard } from '@/components/features/ProductCard';
import { Stories } from '@/components/features/Stories';
import { HomeHeader } from '@/components/layout/Header';
import { Skeleton } from '@/components/ui/Skeleton';
import { useCatalog } from '@/hooks/useCatalog';
import { useI18n } from '@/hooks/useI18n';
import { discountPercent } from '@/lib/utils';

function SectionTitle({ title, href, more }: { title: string; href?: string; more?: string }) {
  return (
    <div className="flex items-baseline justify-between px-4 pb-2.5">
      <h2 className="text-[19px] font-bold">{title}</h2>
      {href && more && (
        <Link href={href} className="flex items-center text-[13px] font-semibold text-brand-ink">
          {more}
          <ChevronRight size={16} strokeWidth={2.25} />
        </Link>
      )}
    </div>
  );
}

export default function HomePage() {
  const { t } = useI18n();
  const router = useRouter();
  const { products, status } = useCatalog();

  // Eng katta chegirmali mahsulotlar — "Ommabop"
  const popular = [...products]
    .sort((a, b) => discountPercent(b.price, b.oldPrice) - discountPercent(a.price, a.oldPrice))
    .slice(0, 4);

  return (
    <div className="space-y-5 pb-2">
      <HomeHeader>
        {/* Qidiruv — katalogdagi qidiruv maydonini ochadi */}
        <Link
          href="/catalog?search=1"
          className="mt-3.5 flex h-12 items-center gap-2.5 rounded-[16px] bg-surface px-4 text-[15px] font-medium text-ink-2"
        >
          <Search size={19} strokeWidth={2} />
          {t('home.searchPlaceholder')}
        </Link>
      </HomeHeader>

      <CategoryTabs value="all" onChange={(id) => router.push(id === 'all' ? '/catalog' : `/catalog?category=${id}`)} />

      <section>
        <SectionTitle title={t('home.promotions')} />
        <div className="px-4">
          <Stories />
        </div>
      </section>

      <HeroWidget />

      <section>
        <SectionTitle title={t('home.popular')} href="/catalog" more={t('home.seeAll')} />
        <div className="grid grid-cols-2 gap-3 px-4">
          {status !== 'ready' && products.length === 0
            ? Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-[250px]" />)
            : popular.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </div>
  );
}
