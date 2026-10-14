'use client';

/** Katalog: kategoriyalar + mahsulotlar to'ri. Mahsulot bosilsa Bottom Sheet ochiladi. */
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { WifiOff } from 'lucide-react';
import { CategoryTabs, type CategoryFilter } from '@/components/features/CategoryTabs';
import { ProductCard } from '@/components/features/ProductCard';
import { PageHeader } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useCatalog } from '@/hooks/useCatalog';
import { useI18n } from '@/hooks/useI18n';

const CATEGORY_IDS: CategoryFilter[] = ['all', 'burgers', 'pizza', 'drinks', 'premium'];

function CatalogContent() {
  const { t } = useI18n();
  const { products, status, error, reload } = useCatalog();
  const searchParams = useSearchParams();
  const initial = searchParams.get('category') as CategoryFilter | null;
  const [category, setCategory] = useState<CategoryFilter>(initial && CATEGORY_IDS.includes(initial) ? initial : 'all');

  const visible = category === 'all' ? products : products.filter((product) => product.category === category);

  return (
    <div>
      <PageHeader title={t('catalog.title')} subtitle={t('catalog.subtitle')} />

      <div className="sticky top-0 z-30 bg-ground pt-1">
        <CategoryTabs value={category} onChange={setCategory} />
      </div>

      <div className="px-4 pt-4">
        {status === 'error' ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-brand-soft text-brand-ink">
              <WifiOff size={26} strokeWidth={1.8} />
            </span>
            <p className="text-ink-2">{t(error === 'NETWORK' ? 'errors.NETWORK' : 'common.loadError')}</p>
            <Button variant="secondary" onClick={reload}>
              {t('common.retry')}
            </Button>
          </div>
        ) : status !== 'ready' && products.length === 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-[262px]" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <p className="py-16 text-center text-ink-2">{t('catalog.empty')}</p>
        ) : (
          <div key={category} className="grid animate-rise grid-cols-2 gap-3">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense>
      <CatalogContent />
    </Suspense>
  );
}
