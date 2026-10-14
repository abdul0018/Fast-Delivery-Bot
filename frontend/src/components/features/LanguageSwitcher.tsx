'use client';

import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/userStore';
import type { Lang } from '@/types';

const OPTIONS: { value: Lang; label: string }[] = [
  { value: 'uz', label: "🇺🇿 O'zbekcha" },
  { value: 'ru', label: '🇷🇺 Русский' },
];

/** UZ / RU almashtirgich — tanlov backend'ga ham saqlanadi (bot ham shu tilda javob beradi) */
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
    <div className={cn('inline-flex rounded-full bg-muted p-1', !compact && 'w-full')}>
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => change(option.value)}
          className={cn(
            'flex-1 rounded-full font-semibold transition-all',
            compact ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-sm',
            lang === option.value ? 'bg-surface text-ink shadow-sm' : 'text-hint',
          )}
        >
          {compact ? option.value.toUpperCase() : option.label}
        </button>
      ))}
    </div>
  );
}
