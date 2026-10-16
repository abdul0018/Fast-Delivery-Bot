'use client';

/**
 * Onboarding — faqat birinchi kirishda ko'rsatiladi.
 * 3 ta slayd: barmoq bilan surish (CSS scroll-snap) yoki "Keyingi" tugmasi.
 * Har bir slayd: katta dumaloq taom rasmi (rangli halqa bilan) va qalin bosh harfli sarlavha.
 */
import { useRef, useState, type ReactNode } from 'react';
import { ClipboardCheck, DoorOpen, Hand } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Wordmark } from '@/components/layout/Header';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import { cn } from '@/lib/utils';
import { useSettingsStore } from '@/store/settingsStore';
import { LanguageSwitcher } from './LanguageSwitcher';

const RINGS = ['bg-brand', 'bg-accent', 'bg-ok'] as const;

function Slide({ image, ring, children }: { image: string; ring: (typeof RINGS)[number]; children: ReactNode }) {
  return (
    <section className="flex w-full shrink-0 snap-center snap-always flex-col px-6">
      <div className="flex min-h-0 flex-1 items-center justify-center py-4">
        <div className={cn('relative aspect-square h-full max-h-[330px] max-w-full rounded-full border-2 border-outline p-3', ring)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="size-full rounded-full border-2 border-outline object-cover" />
        </div>
      </div>
      <div className="shrink-0 pb-2">{children}</div>
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

  const steps = [
    { icon: Hand, key: 'onboarding.slide2Step1' },
    { icon: ClipboardCheck, key: 'onboarding.slide2Step2' },
    { icon: DoorOpen, key: 'onboarding.slide2Step3' },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 mx-auto flex max-w-lg flex-col bg-ground">
      <div className="flex items-start justify-between px-5 pt-4">
        <Wordmark className="text-[18px]" />
        <div className="flex items-center gap-3">
          <LanguageSwitcher compact />
          {!isLast && (
            <button type="button" onClick={finish} className="text-sm font-bold text-ink-2">
              {t('onboarding.skip')}
            </button>
          )}
        </div>
      </div>

      <div
        ref={scroller}
        onScroll={onScroll}
        className="no-scrollbar flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden"
      >
        {/* 1. Muammo / Yechim */}
        <Slide image="/images/products/classic-burger.jpg" ring="bg-brand">
          <h2 className="shout text-[36px]">{t('onboarding.slide1Title')}</h2>
          <p className="mt-3 text-[17px] font-medium text-ink-2">{t('onboarding.slide1Text')}</p>
        </Slide>

        {/* 2. Qanday ishlaydi */}
        <Slide image="/images/products/bag-delivery.jpg" ring="bg-accent">
          <h2 className="shout text-[36px]">{t('onboarding.slide2Title')}</h2>
          <ol className="mt-4 space-y-2">
            {steps.map(({ icon: Icon, key }, i) => (
              <li key={key} className="flex items-center gap-3">
                <span className="price flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-outline bg-accent text-[15px] font-black text-on-accent">
                  {i + 1}
                </span>
                <span className="flex-1 text-[17px] font-extrabold">{t(key)}</span>
                <Icon size={21} strokeWidth={2.25} className="text-ink-2" />
              </li>
            ))}
          </ol>
        </Slide>

        {/* 3. Ijtimoiy isbot (raqamlar har bir restoran uchun almashtiriladi) */}
        <Slide image="/images/products/hero-spread.jpg" ring="bg-ok">
          <h2 className="shout text-[34px]">{t('onboarding.slide3Title')}</h2>
          <p className="mt-3 text-[17px] font-medium text-ink-2">{t('onboarding.rating')}</p>
        </Slide>
      </div>

      <div className="space-y-4 px-6 pt-3 pb-safe">
        <div className="flex justify-center gap-2" role="tablist">
          {Array.from({ length: total }, (_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`${i + 1} / ${total}`}
              onClick={() => goTo(i)}
              className={cn(
                'h-2.5 rounded-full border-2 border-outline transition-all duration-300 ease-pop',
                i === index ? 'w-8 bg-brand' : 'w-2.5 bg-transparent',
              )}
            />
          ))}
        </div>
        <Button size="lg" fullWidth onClick={isLast ? finish : () => goTo(index + 1)} className="mb-2">
          {isLast ? t('onboarding.start') : t('onboarding.next')}
        </Button>
      </div>
    </div>
  );
}
