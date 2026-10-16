'use client';

/** Katalog: qidiruv, kategoriya plitkalari va mahsulotlar to'ri. Mahsulot bosilsa Bottom Sheet ochiladi. */
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, WifiOff, X } from 'lucide-react';
import { CATEGORY_IDS, CategoryTabs, type CategoryFilter } from '@/components/features/CategoryTabs';
import { ProductCard } from '@/components/features/ProductCard';
import { PageHeader } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useCatalog } from '@/hooks/useCatalog';
import { useI18n } from '@/hooks/useI18n';

function CatalogContent() {
  const { t } = useI18n();
  const { products, status, error, reload } = useCatalog();
  const searchParams = useSearchParams();
  const initial = searchParams.get('category') as CategoryFilter | null;
  const [category, setCategory] = useState<CategoryFilter>(initial && CATEGORY_IDS.includes(initial) ? initial : 'all');
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const visible = products.filter(
    (product) =>
      (category === 'all' || product.category === category) &&
      (!q || product.name.uz.toLowerCase().includes(q) || product.name.ru.toLowerCase().includes(q)),
  );

  return (
    <div>
      <PageHeader title={t('catalog.title')} subtitle={t('catalog.subtitle')} />

      <div className="px-4 pb-3">
        <label className="flex h-12 items-center gap-2.5 rounded-[16px] bg-surface px-4 text-ink-2 focus-within:ring-[1.5px] focus-within:ring-brand">
          <Search size={19} strokeWidth={2} className="shrink-0" />
          <input
            id="catalog-search"
            type="search"
            value={query}
            autoFocus={searchParams.get('search') === '1'}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('catalog.searchPlaceholder')}
            className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-ink outline-none placeholder:text-ink-2"
          />
          {query && (
            <button type="button" aria-label={t('common.close')} onClick={() => setQuery('')}>
              <X size={18} strokeWidth={2} />
            </button>
          )}
        </label>
      </div>

      <div className="sticky top-0 z-30 bg-ground pt-1 pb-2">
        <CategoryTabs value={category} onChange={setCategory} />
      </div>

      <div className="px-4 pt-2">
        {status === 'error' ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-soft text-brand-ink">
              <WifiOff size={28} strokeWidth={2} />
            </span>
            <p className="font-medium text-ink-2">{t(error === 'NETWORK' ? 'errors.NETWORK' : 'common.loadError')}</p>
            <Button variant="secondary" onClick={reload}>
              {t('common.retry')}
            </Button>
          </div>
        ) : status !== 'ready' && products.length === 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-[250px]" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <p className="py-16 text-center font-medium text-ink-2">{q ? t('catalog.noResults') : t('catalog.empty')}</p>
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
