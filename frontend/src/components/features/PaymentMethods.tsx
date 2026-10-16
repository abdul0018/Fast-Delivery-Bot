'use client';

/** To'lov usullari: Naqd pul | Payme/Click | Telegram Stars */
import { Banknote, CreditCard, Star, type LucideIcon } from 'lucide-react';
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
    <div className="divide-y-2 divide-outline overflow-hidden rounded-[26px] border-2 border-outline bg-surface" role="radiogroup" aria-label={t('cart.payment')}>
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
            className={cn('flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors disabled:opacity-45', selected && 'bg-muted')}
          >
            <span
              className={cn(
                'flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-outline transition-colors',
                selected ? 'bg-accent text-on-accent' : 'bg-surface text-ink',
              )}
            >
              <Icon size={20} strokeWidth={2.25} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-extrabold">{t(`cart.methods.${id}`)}</span>
              <span className="block text-[13px] font-medium text-ink-2">{enabled ? hint(id) : t('cart.soon')}</span>
            </span>
            <span
              aria-hidden="true"
              className={cn(
                'flex size-6 items-center justify-center rounded-full border-2 border-outline transition-colors',
                selected ? 'bg-brand-fill' : 'bg-surface',
              )}
            >
              {selected && <span className="size-2 rounded-full bg-on-brand" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
