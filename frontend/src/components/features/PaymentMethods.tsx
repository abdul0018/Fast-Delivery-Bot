'use client';

/** To'lov usullari: Naqd pul | Payme/Click | Telegram Stars — bitta oq karta ichidagi radio qatorlar */
import { Banknote, Check, CreditCard, Star, type LucideIcon } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import { cn } from '@/lib/utils';
import type { PaymentMethod } from '@/types';

const METHODS: { id: PaymentMethod; icon: LucideIcon }[] = [
  { id: 'cash', icon: Banknote },
  { id: 'payme_click', icon: CreditCard },
  { id: 'stars', icon: Star },
];

interface PaymentMethodsProps {
  available: PaymentMethod[];
  starsRate: number;
  total: number;
}

export function PaymentMethods({ available, starsRate, total }: PaymentMethodsProps) {
  const { paymentMethod, setPaymentMethod } = useCart();
  const { t } = useI18n();
  const { haptic } = useTelegram();

  const hint = (id: PaymentMethod) =>
    id === 'stars'
      ? t('cart.methods.starsHint', { stars: Math.max(1, Math.ceil(total / starsRate)) })
      : t(`cart.methods.${id}Hint`);

  return (
    <div className="divide-y divide-line overflow-hidden rounded-[20px] bg-surface" role="radiogroup" aria-label={t('cart.payment')}>
      {METHODS.map(({ id, icon: Icon }) => {
        const enabled = available.includes(id);
        const selected = paymentMethod === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={!enabled}
            onClick={() => {
              haptic.select();
              setPaymentMethod(id);
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-200 disabled:cursor-not-allowed"
          >
            <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-tile text-ink', !enabled && 'opacity-45')}>
              <Icon size={20} strokeWidth={1.9} />
            </span>
            <span className={cn('min-w-0 flex-1', !enabled && 'opacity-45')}>
              <span className="block text-[15px] font-medium">{t(`cart.methods.${id}`)}</span>
              <span className="block text-[13px] text-ink-2">{enabled ? hint(id) : t('cart.soon')}</span>
            </span>
            <span
              aria-hidden="true"
              className={cn(
                'flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200',
                selected ? 'border-brand bg-brand text-on-brand' : 'border-line',
                !enabled && 'opacity-45',
              )}
            >
              {selected && <Check size={14} strokeWidth={3} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
