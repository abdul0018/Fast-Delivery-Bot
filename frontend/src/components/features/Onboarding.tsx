'use client';

/**
 * Onboarding — faqat birinchi kirishda ko'rsatiladi.
 * 3 ta slayd: barmoq bilan surish (CSS scroll-snap) yoki "Keyingi" tugmasi.
 */
import { useRef, useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import { cn } from '@/lib/utils';
import { useSettingsStore } from '@/store/settingsStore';
import { LanguageSwitcher } from './LanguageSwitcher';

function Slide({ visual, children }: { visual: ReactNode; children: ReactNode }) {
  return (
    <section className="flex w-full shrink-0 snap-center snap-always flex-col items-center justify-center px-8 text-center">
      <div className="relative mb-10 flex size-64 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand/25 via-sale/10 to-transparent blur-2xl" />
        <div className="absolute inset-6 rounded-full bg-brand-soft" />
        <div className="relative">{visual}</div>
      </div>
      {children}
    </section>
  );
}

export function Onboarding() {
  const { t } = useI18n();
  const { haptic } = useTelegram();
  const completeOnboarding = useSettingsStore((state) => state.completeOnboarding);
  const scroller = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const total = 3;
  const isLast = index === total - 1;

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const next = Math.round(el.scrollLeft / el.clientWidth);
    if (next !== index) {
      setIndex(next);
      haptic.select();
    }
  };

  const goTo = (target: number) => {
    const el = scroller.current;
    el?.scrollTo({ left: target * el.clientWidth, behavior: 'smooth' });
  };

  const finish = () => {
    haptic.notify('success');
    completeOnboarding();
  };

  return (
    <div className="fixed inset-0 z-50 mx-auto flex max-w-lg flex-col bg-surface">
      <div className="flex items-center justify-between px-4 pt-4">
        <LanguageSwitcher compact />
        {!isLast && (
          <button type="button" onClick={finish} className="text-sm font-medium text-hint">
            {t('onboarding.skip')}
          </button>
        )}
      </div>

      <div
        ref={scroller}
        onScroll={onScroll}
        className="no-scrollbar flex flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden"
      >
        {/* 1. Muammo / Yechim */}
        <Slide
          visual={
            <div className="relative text-[110px] leading-none">
              🍔
              <span className="absolute -top-4 -right-10 text-5xl">🍟</span>
              <span className="absolute -bottom-2 -left-10 text-5xl">🥤</span>
            </div>
          }
        >
          <h2 className="text-3xl font-extrabold tracking-tight">{t('onboarding.slide1Title')}</h2>
          <p className="mt-3 text-lg text-hint">{t('onboarding.slide1Text')}</p>
        </Slide>

        {/* 2. Qanday ishlaydi */}
        <Slide visual={<div className="text-[110px] leading-none">🛵</div>}>
          <h2 className="mb-6 text-3xl font-extrabold tracking-tight">{t('onboarding.slide2Title')}</h2>
          <ol className="w-full max-w-xs space-y-3 text-left">
            {(
              [
                ['👆', 'onboarding.slide2Step1'],
                ['🧾', 'onboarding.slide2Step2'],
                ['🚪', 'onboarding.slide2Step3'],
              ] as const
            ).map(([icon, key], i) => (
              <li key={key} className="flex items-center gap-3 rounded-2xl bg-muted px-4 py-3">
                <span className="flex size-8 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                  {i + 1}
                </span>
                <span className="flex-1 text-base font-semibold">{t(key)}</span>
                <span className="text-2xl">{icon}</span>
              </li>
            ))}
          </ol>
        </Slide>

        {/* 3. Ijtimoiy isbot */}
        <Slide
          visual={
            <div className="flex flex-col items-center">
              <div className="flex -space-x-4">
                {['😋', '🤩', '😍', '🥳'].map((face) => (
                  <span
                    key={face}
                    className="flex size-16 items-center justify-center rounded-full border-4 border-surface bg-brand-soft text-4xl"
                  >
                    {face}
                  </span>
                ))}
              </div>
              <span className="mt-4 text-5xl font-black text-brand">10 000+</span>
              <span className="mt-1 text-sm font-semibold text-hint">{t('onboarding.rating')}</span>
            </div>
          }
        >
          <h2 className="text-3xl font-extrabold tracking-tight">{t('onboarding.slide3Title')}</h2>
          <p className="mt-3 text-lg text-hint">{t('onboarding.slide3Text')}</p>
        </Slide>
      </div>

      <div className="space-y-5 px-6 pt-4 pb-safe">
        <div className="flex justify-center gap-2">
          {Array.from({ length: total }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`${i + 1}`}
              onClick={() => goTo(i)}
              className={cn('h-2 rounded-full transition-all duration-300', i === index ? 'w-8 bg-brand' : 'w-2 bg-hint/30')}
            />
          ))}
        </div>
        <Button size="lg" fullWidth onClick={isLast ? finish : () => goTo(index + 1)} className="mb-2">
          {isLast ? `${t('onboarding.start')} 🚀` : t('onboarding.next')}
        </Button>
      </div>
    </div>
  );
}
