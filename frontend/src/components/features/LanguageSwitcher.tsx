'use client';

import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/userStore';
import type { Lang } from '@/types';

const OPTIONS: { value: Lang; label: string }[] = [
  { value: 'uz', label: "O'zbekcha" },
  { value: 'ru', label: 'Русский' },
];

/** UZ / RU almashtirgich — tanlov backend'ga ham saqlanadi (bot ham shu tilda javob beradi) */
export function LanguageSwitcher({ compact = false, onBrand = false }: { compact?: boolean; onBrand?: boolean }) {
  const { lang, setLang } = useI18n();
  const { haptic } = useTelegram();
  const updateMe = useUserStore((state) => state.updateMe);

  const change = (value: Lang) => {
    if (value === lang) return;
    haptic.select();
    setLang(value);
    void updateMe({ language: value });
  };

  return (
    <div
      role="radiogroup"
      className={cn('inline-flex rounded-full p-1', onBrand ? 'bg-white/20' : 'bg-surface', !compact && 'w-full')}
    >
      {OPTIONS.map((option) => {
        const active = lang === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => change(option.value)}
            className={cn(
              'flex-1 rounded-full font-bold transition-colors duration-200',
              compact ? 'px-3 py-1 text-xs' : 'px-4 py-2.5 text-sm',
              active
                ? onBrand
                  ? 'bg-white text-brand-fill'
                  : 'bg-brand-fill text-on-brand'
                : onBrand
                  ? 'text-white'
                  : 'text-ink-2',
            )}
          >
            {compact ? option.value.toUpperCase() : option.label}
          </button>
        );
      })}
    </div>
  );
}
