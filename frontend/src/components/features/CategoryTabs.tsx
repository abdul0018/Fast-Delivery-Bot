'use client';

/**
 * Kategoriyalar — namunadagidek kvadrat plitkalar: faol plitka qizil (oq ikonka),
 * qolganlari och kulrang fonda kategoriya taomining rasmi; nomi plitka ostida.
 */
import { useEffect, useRef } from 'react';
import { Ellipsis } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

export type CategoryFilter = 'all' | Category;

export const CATEGORY_IDS: CategoryFilter[] = ['all', 'burgers', 'pizza', 'drinks', 'premium'];

const IMAGES: Record<Category, string> = {
  burgers: '/images/products/classic-burger.jpg',
  pizza: '/images/products/pepperoni.jpg',
  drinks: '/images/products/coca-cola.jpg',
  premium: '/images/products/black-angus.jpg',
};

export function CategoryTabs({ value, onChange }: { value: CategoryFilter | null; onChange: (value: CategoryFilter) => void }) {
  const { t } = useI18n();
  const { haptic } = useTelegram();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>('[aria-selected="true"]');
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [value]);

  return (
    <div ref={listRef} role="tablist" className="no-scrollbar flex gap-3 overflow-x-auto px-4 py-1">
      {CATEGORY_IDS.map((id) => {
        const active = id === value;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => {
              haptic.select();
              onChange(id);
            }}
            className="flex w-[62px] shrink-0 flex-col items-center gap-1.5"
          >
            <span
              className={cn(
                'flex size-[60px] items-center justify-center overflow-hidden rounded-[16px] transition-colors duration-200',
                active ? 'bg-brand text-on-brand' : 'bg-surface text-ink-2',
              )}
            >
              {id === 'all' ? (
                <Ellipsis size={26} strokeWidth={2.5} />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={IMAGES[id]} alt="" className={cn('size-full object-cover', active && 'opacity-90 mix-blend-luminosity')} />
              )}
            </span>
            <span className={cn('text-[12px] font-semibold', active ? 'text-brand-ink' : 'text-ink-2')}>
              {t(`catalog.categories.${id}`)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
