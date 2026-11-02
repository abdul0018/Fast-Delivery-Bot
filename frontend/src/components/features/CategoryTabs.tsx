'use client';

/**
 * Kategoriyalar ikki ko'rinishda:
 *  - chips  — katalogdagi gorizontal "tabletkalar" (tanlangani brend rangida)
 *  - tiles  — bosh sahifadagi rasmli plitkalar (bosilsa katalogning shu bo'limi ochiladi)
 */
import { useEffect, useRef } from 'react';
import { LayoutGrid } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import { asset, cn } from '@/lib/utils';
import { brand } from '@/config/brand';
import type { TranslationKey } from '@/lib/i18n';
import type { Category } from '@/types';

export type CategoryFilter = 'all' | Category;

// Bo'limlar brand.ts dan olinadi (do'konga qarab o'zgaradi)
export const CATEGORY_IDS: CategoryFilter[] = ['all', ...brand.categories.map((category) => category.id)];

const IMAGES: Record<string, string> = Object.fromEntries(brand.categories.map((category) => [category.id, category.image]));
const label = (id: CategoryFilter) => `catalog.categories.${id}` as TranslationKey;

interface CategoryTabsProps {
  value: CategoryFilter | null;
  onChange: (value: CategoryFilter) => void;
  variant?: 'chips' | 'tiles';
}

export function CategoryTabs({ value, onChange, variant = 'chips' }: CategoryTabsProps) {
  const { t } = useI18n();
  const { haptic } = useTelegram();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>('[aria-selected="true"]');
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [value]);

  const select = (id: CategoryFilter) => {
    haptic.select();
    onChange(id);
  };

  if (variant === 'tiles') {
    const ids = CATEGORY_IDS.filter((id) => id !== 'all');
    return (
      <div className="grid grid-cols-4 gap-2 px-4">
        {ids.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => select(id)}
            className="group flex flex-col items-center gap-1.5 rounded-[18px] bg-surface px-1 pt-2 pb-2.5 transition-transform duration-200 ease-out-expo active:scale-[0.97]"
          >
            <span className="size-[52px] overflow-hidden rounded-full bg-tile">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(IMAGES[id])} alt="" className="size-full scale-110 object-cover" />
            </span>
            <span className="w-full truncate text-center text-[12px] font-medium">{t(label(id))}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={listRef} role="tablist" aria-label={t('catalog.title')} className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-1">
      {CATEGORY_IDS.map((id) => {
        const active = id === value;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => select(id)}
            className={cn(
              'flex h-10 shrink-0 items-center gap-2 rounded-full pr-4 text-[14px] font-medium transition-colors duration-200',
              id === 'all' ? 'pl-3.5' : 'pl-1',
              active ? 'bg-brand text-on-brand' : 'bg-surface text-ink',
            )}
          >
            {id === 'all' ? (
              <LayoutGrid size={17} strokeWidth={2} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={asset(IMAGES[id])} alt="" className="size-8 rounded-full bg-tile object-cover" />
            )}
            {t(label(id))}
          </button>
        );
      })}
    </div>
  );
}
