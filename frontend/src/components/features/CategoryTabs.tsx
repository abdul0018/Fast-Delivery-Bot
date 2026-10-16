'use client';

/** Gorizontal kategoriyalar: konturli kapsulalar, faoli to'q siyoh bilan to'ldirilgan */
import { useEffect, useRef } from 'react';
import { CupSoda, Crown, Pizza, Sandwich, UtensilsCrossed, type LucideIcon } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

export type CategoryFilter = 'all' | Category;

const CATEGORIES: { id: CategoryFilter; icon: LucideIcon }[] = [
  { id: 'all', icon: UtensilsCrossed },
  { id: 'burgers', icon: Sandwich },
  { id: 'pizza', icon: Pizza },
  { id: 'drinks', icon: CupSoda },
  { id: 'premium', icon: Crown },
];

export function CategoryTabs({ value, onChange }: { value: CategoryFilter; onChange: (value: CategoryFilter) => void }) {
  const { t } = useI18n();
  const { haptic } = useTelegram();
  const listRef = useRef<HTMLDivElement>(null);

  // Faol tabni ko'rinadigan joyga suramiz
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>('[aria-selected="true"]');
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [value]);

  return (
    <div ref={listRef} role="tablist" className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-2">
      {CATEGORIES.map(({ id, icon: Icon }) => {
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
            className={cn(
              'flex h-10 shrink-0 items-center gap-1.5 rounded-full border-2 border-outline px-4 text-[14px] font-extrabold transition-colors duration-200',
              active ? 'bg-ink text-ground' : 'bg-transparent text-ink hover:bg-muted',
            )}
          >
            <Icon size={17} strokeWidth={2.25} />
            {t(`catalog.categories.${id}`)}
          </button>
        );
      })}
    </div>
  );
}
