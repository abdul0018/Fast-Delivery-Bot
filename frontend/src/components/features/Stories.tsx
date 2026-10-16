'use client';

/**
 * Instagram stories uslubidagi chegirmalar (UI): yumaloq-to'rtburchak surat plitkalari,
 * ko'rilmaganlari brend rangidagi halqa bilan. Bosilganda to'liq ekranli ko'ruvchi ochiladi.
 */
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import type { TranslationKey } from '@/lib/i18n';
import { cn } from '@/lib/utils';
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
    <div role="dialog" aria-modal="true" aria-label={t(story.title)} className="fixed inset-0 z-[70] mx-auto flex max-w-lg animate-fade-in flex-col bg-surface">
      <div className="relative min-h-0 flex-1 overflow-hidden bg-tile">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={story.id} src={story.image} alt="" className="size-full animate-fade-in object-cover" />
        {/* Progress chiziqlari o'qilishi uchun tepada yengil soyalik */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/35 to-transparent" />
        <div className="absolute inset-x-0 top-0 z-20 flex gap-1 px-3 pt-3">
          {STORIES.map((item, i) => (
            <div key={item.id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/40">
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
          className="absolute top-7 right-3 z-30 flex size-10 items-center justify-center rounded-full bg-white text-ink shadow-(--shadow-thumb)"
        >
          <X size={20} strokeWidth={2.25} />
        </button>
        {/* Chap / o'ng tegish zonalari */}
        <button type="button" aria-label={t('common.prev')} className="absolute inset-y-0 left-0 z-10 w-1/3" onClick={prev} />
        <button type="button" aria-label={t('common.next')} className="absolute inset-y-0 right-0 z-10 w-2/3" onClick={next} />
      </div>
      <div className="relative z-20 -mt-6 rounded-t-[24px] bg-surface px-5 pt-6 pb-safe">
        <h3 className="text-[34px] leading-none font-semibold tracking-[-0.03em]">{t(story.title)}</h3>
        <p className="mt-3 text-[17px] leading-snug text-ink-2">{t(story.text)}</p>
        <Button
          size="lg"
          fullWidth
          className="mt-6 mb-3"
          onClick={() => {
            onClose();
            router.push('/catalog');
          }}
        >
          {t('home.viewCatalog')}
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
      <div className="no-scrollbar flex gap-2.5 overflow-x-auto px-4 py-0.5" aria-label={t('home.storiesTitle')}>
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
              className={cn(
                'shrink-0 rounded-[20px] p-[2.5px] transition-transform duration-200 ease-out-expo active:scale-[0.97]',
                isSeen ? 'bg-transparent' : 'bg-brand',
              )}
            >
              <span className="relative block h-[112px] w-[88px] overflow-hidden rounded-[17.5px] border-2 border-ground bg-tile">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={story.image} alt="" className="size-full object-cover" />
                <span className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/65 to-transparent" />
                <span className="absolute inset-x-2 bottom-2 text-left text-[13px] leading-tight font-semibold text-white">
                  {t(story.title)}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      {openIndex !== null && <StoryViewer startIndex={openIndex} onClose={close} />}
    </>
  );
}
