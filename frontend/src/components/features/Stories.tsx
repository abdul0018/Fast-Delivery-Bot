'use client';

/**
 * Instagram stories uslubidagi chegirmalar bloki (UI).
 * Doiracha bosilganda to'liq ekranli ko'ruvchi ochiladi: avtomatik o'tish, chap/o'ng tegish.
 */
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import type { TranslationKey } from '@/lib/i18n';
import { useSettingsStore } from '@/store/settingsStore';

interface Story {
  id: string;
  image: string;
  title: TranslationKey;
  text: TranslationKey;
}

const img = (name: string) => `/images/products/${name}.jpg`;

const STORIES: Story[] = [
  { id: 'burgers-20', image: img('double-burger'), title: 'stories.s1Title', text: 'stories.s1Text' },
  { id: 'family-combo', image: img('family-combo'), title: 'stories.s2Title', text: 'stories.s2Text' },
  { id: 'black-angus', image: img('black-angus'), title: 'stories.s3Title', text: 'stories.s3Text' },
  { id: 'free-delivery', image: img('bag-delivery'), title: 'stories.s4Title', text: 'stories.s4Text' },
  { id: 'cola-5000', image: img('coca-cola'), title: 'stories.s5Title', text: 'stories.s5Text' },
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
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-[70] mx-auto flex max-w-lg animate-fade-in flex-col bg-brand-fill text-on-brand">
      {/* Progress chiziqlari */}
      <div className="absolute inset-x-0 top-0 z-20 flex gap-1 px-3 pt-3">
        {STORIES.map((item, i) => (
          <div key={item.id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/35">
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
      <button
        type="button"
        onClick={onClose}
        aria-label={t('common.close')}
        className="absolute top-6 right-3 z-30 flex size-10 items-center justify-center rounded-full bg-black/30 text-white"
      >
        <X size={22} strokeWidth={2.25} />
      </button>

      <div className="relative flex-1 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={story.id} src={story.image} alt="" className="size-full animate-fade-in object-cover" />
        {/* Chap / o'ng tegish zonalari */}
        <button type="button" aria-label={t('common.prev')} className="absolute inset-y-0 left-0 z-10 w-1/3" onClick={prev} />
        <button type="button" aria-label={t('common.next')} className="absolute inset-y-0 right-0 z-10 w-2/3" onClick={next} />
      </div>
      <div className="relative z-20 -mt-8 rounded-t-[28px] bg-brand-fill px-6 pt-6 pb-safe">
        <h3 className="text-[44px] leading-none font-black">{t(story.title)}</h3>
        <p className="mt-3 text-lg font-medium text-on-brand">{t(story.text)}</p>
        <Button
          variant="inverse"
          size="lg"
          fullWidth
          className="mt-6 mb-3"
          onClick={() => {
            onClose();
            router.push('/catalog');
          }}
        >
          {t('home.viewCatalog')}
          <ArrowRight size={18} strokeWidth={2.25} />
        </Button>
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
      {/* "Aksiyalar" — namunadagi Promotions kartalari; har biri Instagram stories'dek ochiladi */}
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4" aria-label={t('home.storiesTitle')}>
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
              className="flex w-[210px] shrink-0 items-center gap-3 rounded-[18px] bg-surface p-2.5 pr-3 text-left"
            >
              <span className={isSeen ? 'inline-flex shrink-0 rounded-full p-[2px] ring-2 ring-line' : 'inline-flex shrink-0 rounded-full p-[2px] ring-2 ring-brand'}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={story.image} alt="" className="size-12 rounded-full object-cover" />
              </span>
              <span className="min-w-0">
                <span className="block text-[15px] font-bold">{t(story.title)}</span>
                <span className="line-clamp-2 block text-[12px] leading-snug font-medium text-ink-2">{t(story.text)}</span>
              </span>
            </button>
          );
        })}
      </div>
      {openIndex !== null && <StoryViewer startIndex={openIndex} onClose={close} />}
    </>
  );
}
