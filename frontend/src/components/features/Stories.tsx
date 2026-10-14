'use client';

/**
 * Instagram stories uslubidagi chegirmalar bloki (UI).
 * Doiracha bosilganda to'liq ekranli ko'ruvchi ochiladi: avtomatik o'tish, chap/o'ng tegish.
 */
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import type { TranslationKey } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { useSettingsStore } from '@/store/settingsStore';

interface Story {
  id: string;
  emoji: string;
  gradient: string;
  title: TranslationKey;
  text: TranslationKey;
}

const STORIES: Story[] = [
  { id: 'burgers-20', emoji: '🍔', gradient: 'from-orange-500 to-red-600', title: 'stories.s1Title', text: 'stories.s1Text' },
  { id: 'family-combo', emoji: '🍱', gradient: 'from-fuchsia-500 to-purple-700', title: 'stories.s2Title', text: 'stories.s2Text' },
  { id: 'black-angus', emoji: '🥩', gradient: 'from-zinc-700 to-zinc-950', title: 'stories.s3Title', text: 'stories.s3Text' },
  { id: 'free-delivery', emoji: '🛵', gradient: 'from-emerald-500 to-teal-700', title: 'stories.s4Title', text: 'stories.s4Text' },
  { id: 'cola-5000', emoji: '🥤', gradient: 'from-red-500 to-rose-700', title: 'stories.s5Title', text: 'stories.s5Text' },
];

const STORY_DURATION_MS = 5000;

function StoryViewer({ startIndex, onClose }: { startIndex: number; onClose: () => void }) {
  const { t } = useI18n();
  const router = useRouter();
  const markStorySeen = useSettingsStore((state) => state.markStorySeen);
  const [index, setIndex] = useState(startIndex);
  const story = STORIES[index];

  const next = useCallback(() => {
    if (index < STORIES.length - 1) setIndex(index + 1);
    else onClose();
  }, [index, onClose]);
  const prev = () => setIndex(Math.max(0, index - 1));

  useEffect(() => {
    markStorySeen(story.id);
    const timer = setTimeout(next, STORY_DURATION_MS);
    return () => clearTimeout(timer);
  }, [story.id, next, markStorySeen]);

  return createPortal(
    <div className={cn('fixed inset-0 z-[70] mx-auto flex max-w-lg animate-fade-in flex-col bg-gradient-to-br text-white', story.gradient)}>
      {/* Progress chiziqlari */}
      <div className="flex gap-1 px-3 pt-3">
        {STORIES.map((item, i) => (
          <div key={item.id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
            {i < index && <div className="h-full w-full bg-white" />}
            {i === index && (
              <div
                key={story.id}
                className="h-full w-full origin-left animate-story bg-white"
                style={{ animationDuration: `${STORY_DURATION_MS}ms` }}
              />
            )}
          </div>
        ))}
      </div>
      <button type="button" onClick={onClose} aria-label={t('common.close')} className="absolute top-6 right-4 z-10 text-3xl">
        ×
      </button>

      {/* Chap / o'ng tegish zonalari */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-8 text-center">
        <button type="button" aria-label="prev" className="absolute inset-y-0 left-0 w-1/3" onClick={prev} />
        <button type="button" aria-label="next" className="absolute inset-y-0 right-0 w-2/3" onClick={next} />
        <span className="animate-pop text-[140px] leading-none drop-shadow-2xl">{story.emoji}</span>
        <h3 className="mt-8 text-5xl font-black">{t(story.title)}</h3>
        <p className="mt-4 text-xl font-medium text-white/90">{t(story.text)}</p>
      </div>

      <div className="relative z-10 px-6 pb-safe">
        <button
          type="button"
          onClick={() => {
            onClose();
            router.push('/catalog');
          }}
          className="mb-4 h-14 w-full rounded-2xl bg-white text-base font-bold text-zinc-900 active:scale-[0.98]"
        >
          {t('home.viewCatalog')} →
        </button>
      </div>
    </div>,
    document.body,
  );
}

export function Stories() {
  const { t } = useI18n();
  const { haptic } = useTelegram();
  const seen = useSettingsStore((state) => state.seenStories);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const close = useCallback(() => setOpenIndex(null), []);

  return (
    <>
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 py-2">
        {STORIES.map((story, i) => {
          const isSeen = seen.includes(story.id);
          return (
            <button
              key={story.id}
              type="button"
              onClick={() => {
                haptic.impact('light');
                setOpenIndex(i);
              }}
              className="flex w-[72px] shrink-0 flex-col items-center gap-1.5"
            >
              <span
                className={cn(
                  'rounded-full p-[2.5px]',
                  isSeen ? 'bg-hint/30' : 'bg-gradient-to-tr from-yellow-400 via-brand to-fuchsia-600',
                )}
              >
                <span className="block rounded-full bg-bg p-[2.5px]">
                  <span className={cn('flex size-[60px] items-center justify-center rounded-full bg-gradient-to-br text-3xl', story.gradient)}>
                    {story.emoji}
                  </span>
                </span>
              </span>
              <span className="w-full truncate text-center text-xs font-medium">{t(story.title)}</span>
            </button>
          );
        })}
      </div>
      {openIndex !== null && <StoryViewer startIndex={openIndex} onClose={close} />}
    </>
  );
}
