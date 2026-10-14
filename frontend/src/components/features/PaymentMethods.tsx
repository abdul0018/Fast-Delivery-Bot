'use client';

/** To'lov usullari: Naqd pul | Payme/Click | Telegram Stars */
import { useCart } from '@/hooks/useCart';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import { cn } from '@/lib/utils';
import type { PaymentMethod } from '@/types';

const METHODS: { id: PaymentMethod; icon: string }[] = [
  { id: 'cash', icon: '💵' },
  { id: 'payme_click', icon: '💳' },
  { id: 'stars', icon: '⭐' },
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
    <div className="grid gap-2" role="radiogroup">
      {METHODS.map((method) => {
        const enabled = available.includes(method.id);
        const selected = paymentMethod === method.id;
        return (
          <button
            key={method.id}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={!enabled}
            onClick={() => {
              haptic.select();
              setPaymentMethod(method.id);
            }}
            className={cn(
              'flex items-center gap-3 rounded-2xl border-2 bg-surface p-3 text-left transition-all disabled:opacity-50',
              selected ? 'border-brand shadow-md shadow-brand/10' : 'border-transparent',
            )}
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-muted text-2xl">{method.icon}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold">{t(`cart.methods.${method.id}`)}</span>
              <span className="block text-xs text-hint">{enabled ? hint(method.id) : t('cart.soon')}</span>
            </span>
            <span
              className={cn(
                'flex size-6 items-center justify-center rounded-full border-2 transition',
                selected ? 'border-brand bg-brand' : 'border-hint/40',
              )}
            >
              {selected && <span className="size-2 rounded-full bg-white" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
