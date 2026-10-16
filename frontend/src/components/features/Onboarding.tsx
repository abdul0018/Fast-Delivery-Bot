'use client';

/**
 * Onboarding — faqat birinchi kirishda ko'rsatiladi.
 * 3 ta slayd: barmoq bilan surish (CSS scroll-snap) yoki "Keyingi" tugmasi.
 * Har bir slayd: katta yumaloq burchakli taom surati, sarlavha va matn.
 */
import { useRef, useState, type ReactNode } from 'react';
import { ClipboardCheck, DoorOpen, Pointer, Star } from 'lucide-react';
import { Logo } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import { cn } from '@/lib/utils';
import { useSettingsStore } from '@/store/settingsStore';
import { LanguageSwitcher } from './LanguageSwitcher';

function Slide({ image, children }: { image: string; children: ReactNode }) {
  return (
    <section className="flex w-full shrink-0 snap-center snap-always flex-col px-4">
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-[28px] bg-tile">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" className="size-full object-cover" />
      </div>
      <div className="shrink-0 px-2 pt-6">{children}</div>
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
    { icon: Pointer, key: 'onboarding.slide2Step1' },
    { icon: ClipboardCheck, key: 'onboarding.slide2Step2' },
    { icon: DoorOpen, key: 'onboarding.slide2Step3' },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 mx-auto flex max-w-lg flex-col bg-ground">
      <div className="flex items-center justify-between px-4 pt-3 pb-3">
        <Logo />
        <LanguageSwitcher compact />
      </div>

      <div
        ref={scroller}
        onScroll={onScroll}
        className="no-scrollbar flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden"
      >
        {/* 1. Muammo / Yechim */}
        <Slide image="/images/products/classic-burger.jpg">
          <h2 className="text-[30px] leading-[1.1] font-semibold tracking-[-0.03em]">{t('onboarding.slide1Title')}</h2>
          <p className="mt-2.5 text-[17px] leading-snug text-ink-2">{t('onboarding.slide1Text')}</p>
        </Slide>

        {/* 2. Qanday ishlaydi */}
        <Slide image="/images/products/bag-delivery.jpg">
          <h2 className="text-[30px] leading-[1.1] font-semibold tracking-[-0.03em]">{t('onboarding.slide2Title')}</h2>
          <ol className="mt-4 grid grid-cols-3 gap-2">
            {steps.map(({ icon: Icon, key }, i) => (
              <li key={key} className="flex flex-col gap-2.5 rounded-[18px] bg-surface p-3">
                <span className="flex items-center justify-between">
                  <span className="price flex size-7 items-center justify-center rounded-full bg-brand text-[13px] font-semibold text-on-brand">
                    {i + 1}
                  </span>
                  <Icon size={19} strokeWidth={1.9} className="text-ink-2" />
                </span>
                <span className="text-[14px] leading-tight font-medium">{t(key)}</span>
              </li>
            ))}
          </ol>
        </Slide>

        {/* 3. Ijtimoiy isbot (raqamlar har bir restoran uchun almashtiriladi) */}
        <Slide image="/images/products/hero-spread.jpg">
          <h2 className="text-[30px] leading-[1.1] font-semibold tracking-[-0.03em]">{t('onboarding.slide3Title')}</h2>
          <p className="mt-2.5 flex items-center gap-1.5 text-[17px] text-ink-2">
            <Star size={18} strokeWidth={0} className="fill-brand" />
            {t('onboarding.rating')}
          </p>
        </Slide>
      </div>

      <div className="flex items-center gap-3 px-4 pt-6 pb-safe">
        <div className="flex gap-1.5" role="tablist" aria-label={t('onboarding.progress')}>
          {Array.from({ length: total }, (_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`${i + 1} / ${total}`}
              onClick={() => goTo(i)}
              className={cn(
                'h-2 rounded-full transition-all duration-300 ease-out-expo',
                i === index ? 'w-6 bg-ink' : 'w-2 bg-ink/20',
              )}
            />
          ))}
        </div>
        <div className={cn('flex items-center gap-1', isLast ? 'flex-1' : 'ml-auto')}>
          {!isLast && (
            <Button variant="ghost" size="lg" onClick={finish} className="px-3 text-[15px] whitespace-nowrap text-ink-2">
              {t('onboarding.skip')}
            </Button>
          )}
          <Button size="lg" onClick={isLast ? finish : () => goTo(index + 1)} className={cn('mb-1', isLast ? 'flex-1' : 'min-w-[116px]')}>
            {isLast ? t('onboarding.start') : t('onboarding.next')}
          </Button>
        </div>
      </div>
    </div>
  );
}
