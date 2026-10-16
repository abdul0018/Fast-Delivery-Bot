'use client';

/** Bosh sahifa: manzil va salom, qidiruv, stories, banner, kategoriyalar, ommabop */
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
    <div className="flex items-center justify-between px-4 pb-3">
      <h2 className="text-[20px] leading-tight font-semibold">{title}</h2>
      {href && more && (
        <Link href={href} className="-mr-1 flex items-center gap-0.5 rounded-[10px] px-1 text-[14px] font-medium text-ink-2">
          {more}
          <ChevronRight size={17} strokeWidth={2} />
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
    .slice(0, 6);

  return (
    <div className="space-y-6 pb-2">
      <HomeHeader>
        {/* Qidiruv — katalogdagi qidiruv maydonini ochadi */}
        <Link
          href="/catalog?search=1"
          className="mt-4 flex h-12 items-center gap-2.5 rounded-[14px] bg-surface px-4 text-[15px] text-ink-2"
        >
          <Search size={19} strokeWidth={2} />
          {t('home.searchPlaceholder')}
        </Link>
      </HomeHeader>

      <Stories />

      <HeroWidget />

      <section>
        <SectionTitle title={t('catalog.title')} href="/catalog" more={t('home.seeAll')} />
        <CategoryTabs variant="tiles" value={null} onChange={(id) => router.push(`/catalog?category=${id}`)} />
      </section>

      <section>
        <SectionTitle title={t('home.popular')} href="/catalog" more={t('home.seeAll')} />
        <div className="no-scrollbar flex gap-2.5 overflow-x-auto px-4 pb-1">
          {status !== 'ready' && products.length === 0
            ? Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-[236px] w-[164px] shrink-0" />)
            : popular.map((product) => <ProductCard key={product.id} product={product} className="w-[164px] shrink-0" />)}
        </div>
      </section>
    </div>
  );
}
