'use client';

import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

export type CategoryFilter = 'all' | Category;

const CATEGORIES: { id: CategoryFilter; icon: string }[] = [
  { id: 'all', icon: '🍽️' },
  { id: 'burgers', icon: '🍔' },
  { id: 'pizza', icon: '🍕' },
  { id: 'drinks', icon: '🥤' },
  { id: 'premium', icon: '👑' },
];

/** Gorizontal skroll qilinadigan kategoriyalar */
export function CategoryTabs({ value, onChange }: { value: CategoryFilter; onChange: (value: CategoryFilter) => void }) {
  const { t } = useI18n();
  const { haptic } = useTelegram();

  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-2">
      {CATEGORIES.map((category) => {
        const active = category.id === value;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => {
              haptic.select();
              onChange(category.id);
            }}
            className={cn(
              'flex h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-all',
              active ? 'bg-brand text-white shadow-md shadow-brand/30' : 'bg-surface text-ink',
            )}
          >
            <span>{category.icon}</span>
            {t(`catalog.categories.${category.id}`)}
          </button>
        );
      })}
    </div>
  );
}
