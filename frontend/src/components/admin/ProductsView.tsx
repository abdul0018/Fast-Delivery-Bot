'use client';

/**
 * Mahsulotlar ro'yxati: qidiruv, kategoriya bo'yicha filtr, katalogda ko'rsatish/yashirish (bir bosishda),
 * bosilganda — tahrirlash oynasi; "+ Добавить" — yangi mahsulot.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ImageOff, PackageSearch, Plus, Search } from 'lucide-react';
import { Switch } from '@/components/ui/Switch';
import { adminApi, adminErrorText, type AdminProduct } from '@/lib/adminApi';
import { asset, cn, formatPrice } from '@/lib/utils';
import { CATEGORY_LABELS, Chips, EmptyState, ListSkeleton, useAdminToast } from './adminUi';
import { ProductEditor } from './ProductEditor';

export function ProductsView() {
  const toast = useAdminToast();
  const [products, setProducts] = useState<AdminProduct[] | null>(null);
  const [categories, setCategories] = useState<string[]>(Object.keys(CATEGORY_LABELS));
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  // undefined — yopiq, null — yangi mahsulot, obyekt — tahrirlash
  const [editing, setEditing] = useState<AdminProduct | null | undefined>(undefined);

  const load = useCallback(async () => {
    try {
      const data = await adminApi.getProducts();
      setProducts(data.products);
      if (data.categories?.length) setCategories(data.categories);
    } catch (error) {
      toast(adminErrorText(error), 'error');
      setProducts((current) => current ?? []);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return (products ?? []).filter(
      (product) =>
        (category === 'all' || product.category === category) &&
        (!needle || `${product.name.ru} ${product.name.uz}`.toLowerCase().includes(needle)),
    );
  }, [products, category, query]);

  const counts = useMemo(() => {
    const result: Record<string, number> = { all: products?.length ?? 0 };
    for (const product of products ?? []) result[product.category] = (result[product.category] ?? 0) + 1;
    return result;
  }, [products]);

  const replace = (product: AdminProduct) =>
    setProducts((current) => {
      const list = current ?? [];
      const exists = list.some((item) => item.id === product.id);
      const next = exists ? list.map((item) => (item.id === product.id ? product : item)) : [...list, product];
      // Savatcha taklifi faqat bitta mahsulotda bo'ladi (backend ham shunday qiladi)
      return product.isUpsell ? next.map((item) => (item.id === product.id ? item : { ...item, isUpsell: false })) : next;
    });

  const toggleActive = async (product: AdminProduct, isActive: boolean) => {
    replace({ ...product, isActive });
    try {
      replace(await adminApi.updateProduct(product.id, { isActive }));
      toast(isActive ? 'Товар показан в каталоге' : 'Товар скрыт из каталога');
    } catch (error) {
      replace(product);
      toast(adminErrorText(error), 'error');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-[24px] font-semibold tracking-[-0.02em]">Товары</h1>
        <button
          type="button"
          onClick={() => setEditing(null)}
          className="flex h-10 items-center gap-1.5 rounded-[14px] bg-brand px-4 text-[15px] font-semibold text-on-brand active:scale-[0.98]"
        >
          <Plus size={18} strokeWidth={2.4} />
          Добавить
        </button>
      </div>

      <label className="flex h-11 items-center gap-2 rounded-[14px] bg-surface px-3.5 text-ink-2">
        <Search size={17} />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Поиск товара"
          className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-2"
        />
      </label>

      <Chips
        label="Категория"
        value={category}
        onChange={setCategory}
        options={[
          { value: 'all', label: 'Все', count: counts.all },
          ...categories.map((id) => ({ value: id, label: CATEGORY_LABELS[id] ?? id, count: counts[id] })),
        ]}
      />

      {!products ? (
        <ListSkeleton rows={6} />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={<PackageSearch size={26} />}
          title={query ? 'Ничего не найдено' : 'Здесь пока нет товаров'}
          text={query ? 'Попробуйте другое название' : 'Нажмите «Добавить», чтобы создать товар'}
        />
      ) : (
        <ul className="space-y-2">
          {visible.map((product) => (
            <li key={product.id} className="flex items-center gap-3 rounded-[20px] bg-surface p-2.5 pr-3.5">
              <button
                type="button"
                onClick={() => setEditing(product)}
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
              >
                {product.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={asset(product.image)}
                    alt=""
                    loading="lazy"
                    className={cn('size-16 shrink-0 rounded-[14px] bg-tile object-cover', !product.isActive && 'opacity-50')}
                  />
                ) : (
                  <span className="flex size-16 shrink-0 items-center justify-center rounded-[14px] bg-tile text-ink-2">
                    <ImageOff size={20} />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className={cn('line-clamp-2 text-[15px] leading-snug font-medium', !product.isActive && 'text-ink-2')}>
                    {product.name.ru}
                  </span>
                  <span className="mt-1 flex flex-wrap items-baseline gap-x-1.5 text-[14px]">
                    <span className="price font-semibold">{formatPrice(product.price)} сум</span>
                    {product.unit.ru && <span className="text-ink-2">/ {product.unit.ru}</span>}
                    {product.oldPrice && (
                      <span className="price text-[12px] text-ink-2 line-through">{formatPrice(product.oldPrice)}</span>
                    )}
                  </span>
                  <span className="mt-1 flex flex-wrap gap-1">
                    {!product.isActive && (
                      <span className="rounded-full bg-tile px-2 py-px text-[11px] font-medium text-ink-2">Скрыт</span>
                    )}
                    {product.isUpsell && (
                      <span className="rounded-full bg-brand-soft px-2 py-px text-[11px] font-medium text-brand-ink">
                        Предложение в корзине
                      </span>
                    )}
                  </span>
                </span>
              </button>
              <Switch
                checked={product.isActive}
                onChange={(checked) => toggleActive(product, checked)}
                label={product.isActive ? 'Скрыть из каталога' : 'Показать в каталоге'}
              />
            </li>
          ))}
        </ul>
      )}

      {editing !== undefined && (
        <ProductEditor
          product={editing}
          categories={categories}
          defaultCategory={category === 'all' ? categories[0] : category}
          onClose={() => setEditing(undefined)}
          onSaved={(product) => {
            replace(product);
            setEditing(undefined);
          }}
          onDeleted={(id) => {
            setProducts((current) => (current ?? []).filter((item) => item.id !== id));
            setEditing(undefined);
          }}
        />
      )}
    </div>
  );
}
