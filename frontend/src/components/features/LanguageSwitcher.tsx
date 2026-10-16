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

/** UZ / RU segment boshqaruvi — tanlov backend'ga ham saqlanadi (bot ham shu tilda javob beradi) */
export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
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
    <div role="radiogroup" className={cn('inline-flex rounded-[12px] bg-tile p-[3px]', !compact && 'w-full')}>
      {OPTIONS.map((option) => {
        const active = lang === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={option.label}
            onClick={() => change(option.value)}
            className={cn(
              'flex-1 rounded-[9px] font-medium transition-[background-color,color,box-shadow] duration-200',
              compact ? 'px-3 py-1.5 text-[13px]' : 'px-4 py-2 text-[14px]',
              active ? 'bg-surface text-ink shadow-(--shadow-thumb)' : 'text-ink-2',
            )}
          >
            {compact ? option.value.toUpperCase() : option.label}
          </button>
        );
      })}
    </div>
  );
}
