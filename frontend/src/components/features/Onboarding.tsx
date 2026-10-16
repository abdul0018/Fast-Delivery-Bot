'use client';

/**
 * Onboarding — faqat birinchi kirishda ko'rsatiladi (namunadagi qizil splash uslubida).
 * 3 ta slayd: barmoq bilan surish (CSS scroll-snap) yoki "Keyingi" tugmasi.
 * Har bir slayd: oq likopchadagi taom, oq sarlavha va matn.
 */
import { useRef, useState, type ReactNode } from 'react';
import { ClipboardCheck, DoorOpen, Hand } from 'lucide-react';
import { Logo } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import { cn } from '@/lib/utils';
import { useSettingsStore } from '@/store/settingsStore';
import { LanguageSwitcher } from './LanguageSwitcher';

function Slide({ image, children }: { image: string; children: ReactNode }) {
  return (
    <section className="flex w-full shrink-0 snap-center snap-always flex-col px-7">
      <div className="flex min-h-0 flex-1 items-center justify-center py-4">
        {/* Oq likopcha */}
        <span className="flex aspect-square h-full max-h-[260px] max-w-full items-center justify-center rounded-full bg-white shadow-[0_20px_40px_-20px_rgba(0,0,0,0.45)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="size-[80%] rounded-full object-cover" />
        </span>
      </div>
      <div className="shrink-0 pb-2 text-center">{children}</div>
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
    <div className="fixed inset-0 z-50 mx-auto flex max-w-lg flex-col bg-brand-fill text-on-brand">
      <div className="flex items-center justify-between px-5 pt-4">
        <LanguageSwitcher compact onBrand />
        {!isLast && (
          <button type="button" onClick={finish} className="text-sm font-semibold opacity-90">
            {t('onboarding.skip')}
          </button>
        )}
      </div>
      <div className="flex justify-center pt-3">
        <Logo />
      </div>

      <div
        ref={scroller}
        onScroll={onScroll}
        className="no-scrollbar flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden"
      >
        {/* 1. Muammo / Yechim */}
        <Slide image="/images/products/classic-burger.jpg">
          <h2 className="text-[30px] leading-tight font-black">{t('onboarding.slide1Title')}</h2>
          <p className="mt-2 text-[16px] font-medium opacity-90">{t('onboarding.slide1Text')}</p>
        </Slide>

        {/* 2. Qanday ishlaydi */}
        <Slide image="/images/products/bag-delivery.jpg">
          <h2 className="text-[30px] leading-tight font-black">{t('onboarding.slide2Title')}</h2>
          <ol className="mx-auto mt-3 w-fit space-y-2 text-left">
            {steps.map(({ icon: Icon, key }, i) => (
              <li key={key} className="flex items-center gap-3">
                <span className="price flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-[14px] font-bold text-[#e00000]">
                  {i + 1}
                </span>
                <span className="text-[17px] font-bold">{t(key)}</span>
                <Icon size={20} strokeWidth={2} className="opacity-80" />
              </li>
            ))}
          </ol>
        </Slide>

        {/* 3. Ijtimoiy isbot (raqamlar har bir restoran uchun almashtiriladi) */}
        <Slide image="/images/products/hero-spread.jpg">
          <h2 className="text-[28px] leading-tight font-black">{t('onboarding.slide3Title')}</h2>
          <p className="mt-2 text-[16px] font-medium opacity-90">{t('onboarding.rating')}</p>
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
              className={cn('h-2 rounded-full transition-all duration-300 ease-out-expo', i === index ? 'w-7 bg-white' : 'w-2 bg-white/45')}
            />
          ))}
        </div>
        <Button variant="inverse" size="lg" fullWidth onClick={isLast ? finish : () => goTo(index + 1)} className="mb-2">
          {isLast ? t('onboarding.start') : t('onboarding.next')}
        </Button>
      </div>
    </div>
  );
}
