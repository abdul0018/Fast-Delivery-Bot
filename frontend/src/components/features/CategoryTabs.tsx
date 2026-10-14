'use client';

/**
 * Gorizontal kategoriyalar + atlas lentasi.
 * Imzo harakati: kategoriya almashganda tagidagi abr lentasi bir naqsh qadamiga "siljiydi".
 */
import { useEffect, useRef, type CSSProperties } from 'react';
import { CupSoda, Crown, Pizza, Sandwich, UtensilsCrossed, type LucideIcon } from 'lucide-react';
import { AtlasBand } from '@/components/ui/AtlasBand';
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

const RAIL_TILE = 64;

export function CategoryTabs({ value, onChange }: { value: CategoryFilter; onChange: (value: CategoryFilter) => void }) {
  const { t } = useI18n();
  const { haptic } = useTelegram();
  const listRef = useRef<HTMLDivElement>(null);
  const index = Math.max(0, CATEGORIES.findIndex((category) => category.id === value));
  // Silkinish yo'nalishi: o'ngdagi kategoriyaga o'tilsa naqsh o'ngdan, chapga — chapdan oqib keladi
  const previousIndex = useRef(index);
  const direction = index >= previousIndex.current ? 1 : -1;
  useEffect(() => {
    previousIndex.current = index;
  }, [index]);

  // Faol tabni ko'rinadigan joyga suramiz
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>('[aria-selected="true"]');
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [value]);

  return (
    <div>
      <div ref={listRef} role="tablist" className="no-scrollbar flex gap-2 overflow-x-auto px-4 pt-1 pb-3">
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
                'flex h-10 shrink-0 items-center gap-1.5 rounded-[12px] border px-3.5 text-sm font-semibold transition-colors duration-200',
                active ? 'border-brand bg-brand text-on-brand' : 'border-line bg-surface text-ink hover:bg-muted',
              )}
            >
              <Icon size={17} strokeWidth={1.75} />
              {t(`catalog.categories.${id}`)}
            </button>
          );
        })}
      </div>

      {/* Atlas lentasi — faol kategoriya indeksi bo'yicha siljiydi */}
      <div className="overflow-hidden" aria-hidden="true">
        <div
          className="transition-transform duration-[320ms] ease-silk"
          style={{
            width: `calc(100% + ${RAIL_TILE * CATEGORIES.length}px)`,
            transform: `translateX(-${index * (RAIL_TILE / 2)}px)`,
          }}
        >
          <div
            key={value}
            className="origin-bottom animate-silk-ripple"
            style={
              {
                '--ripple-from': `${direction * RAIL_TILE}px`,
                '--ripple-skew': `${direction * -22}deg`,
              } as CSSProperties
            }
          >
            <AtlasBand variant="rail" height={16} tile={RAIL_TILE} seed={3} />
          </div>
        </div>
      </div>
    </div>
  );
}
