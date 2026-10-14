'use client';

/**
 * Onboarding — faqat birinchi kirishda ko'rsatiladi.
 * 3 ta slayd: barmoq bilan surish (CSS scroll-snap) yoki "Keyingi" tugmasi.
 * Har bir slaydning yuqori qismi — brend rangidagi atlas maydoni, pastki cheti abr lentasi.
 */
import { useRef, useState, type ReactNode } from 'react';
import { ClipboardCheck, DoorOpen, Hand, Star } from 'lucide-react';
import { AtlasBand } from '@/components/ui/AtlasBand';
import { Button } from '@/components/ui/Button';
import { brand } from '@/config/brand';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import { cn } from '@/lib/utils';
import { useSettingsStore } from '@/store/settingsStore';
import { LanguageSwitcher } from './LanguageSwitcher';

function Slide({ image, seed, children }: { image: string; seed: number; children: ReactNode }) {
  return (
    <section className="flex w-full shrink-0 snap-center snap-always flex-col">
      <div className="bg-brand px-6 pt-16 pb-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt=""
          className="mx-auto aspect-square w-full max-w-[320px] rounded-[28px] object-cover shadow-[0_24px_48px_-24px_rgba(0,0,0,0.6)]"
        />
      </div>
      <AtlasBand variant="edge" height={30} tile={84} seed={seed} />
      <div className="flex flex-1 flex-col px-6 pt-4">{children}</div>
    </section>
  );
}

/** Sarlavhadagi "10,000+" / "10 000+" raqamini brend rangida, kattaroq ajratib ko'rsatish */
function Highlighted({ text }: { text: string }) {
  const match = /\d[\d\s,.\u00A0]*\+/.exec(text);
  if (!match) return <>{text}</>;
  const [number] = match;
  return (
    <>
      {text.slice(0, match.index)}
      <span className="price block text-[48px] leading-[1.05] font-extrabold text-brand-ink">{number.trim()}</span>
      {text.slice(match.index + number.length).trim()}
    </>
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
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 pt-4 text-on-brand">
        <span className="font-display text-[15px] font-semibold">{brand.name}</span>
        <div className="flex items-center gap-3">
          <LanguageSwitcher compact onBrand />
          {!isLast && (
            <button type="button" onClick={finish} className="text-sm font-medium text-on-brand/80">
              {t('onboarding.skip')}
            </button>
          )}
        </div>
      </div>

      <div
        ref={scroller}
        onScroll={onScroll}
        className="no-scrollbar flex flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden"
      >
        {/* 1. Muammo / Yechim */}
        <Slide image="/images/products/classic-burger.jpg" seed={11}>
          <h2 className="text-[30px] leading-[1.05] font-bold">{t('onboarding.slide1Title')}</h2>
          <p className="mt-3 text-[17px] text-ink-2">{t('onboarding.slide1Text')}</p>
        </Slide>

        {/* 2. Qanday ishlaydi */}
        <Slide image="/images/products/bag-delivery.jpg" seed={19}>
          <h2 className="text-[30px] leading-[1.05] font-bold">{t('onboarding.slide2Title')}</h2>
          <ol className="mt-4 space-y-2">
            {steps.map(({ icon: Icon, key }, i) => (
              <li key={key} className="flex items-center gap-3">
                <span className="price flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-brand text-sm font-bold text-on-brand">
                  {i + 1}
                </span>
                <span className="flex-1 text-[17px] font-semibold">{t(key)}</span>
                <Icon size={20} strokeWidth={1.8} className="text-ink-2" />
              </li>
            ))}
          </ol>
        </Slide>

        {/* 3. Ijtimoiy isbot (raqamlar har bir restoran uchun almashtiriladi) */}
        <Slide image="/images/products/hero-spread.jpg" seed={27}>
          <h2 className="text-[30px] leading-[1.05] font-bold">
            <Highlighted text={t('onboarding.slide3Title')} />
          </h2>
          <p className="mt-2 flex items-center gap-1.5 text-[15px] font-medium text-ink-2">
            <Star size={16} strokeWidth={0} className="fill-silk-3" />
            {t('onboarding.rating')}
          </p>
        </Slide>
      </div>

      <div className="space-y-4 px-6 pt-3 pb-safe">
        <div className="flex justify-center gap-1.5" role="tablist">
          {Array.from({ length: total }, (_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`${i + 1} / ${total}`}
              onClick={() => goTo(i)}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300 ease-silk',
                i === index ? 'w-7 bg-brand' : 'w-1.5 bg-ink-2/30',
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
