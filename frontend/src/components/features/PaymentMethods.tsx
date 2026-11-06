'use client';

/**
 * To'lov usullari — faqat backend yoqqan usullar ko'rsatiladi (/api/config).
 * Naqd pul; "Karta orqali" — admin panelda karta raqami saqlangan bo'lsa; Payme/Click — PAYMENT_PROVIDER_TOKEN bilan.
 */
import { Banknote, Check, CreditCard, Wallet, type LucideIcon } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import { cn } from '@/lib/utils';
import type { PaymentMethod } from '@/types';

const METHODS: { id: PaymentMethod; icon: LucideIcon }[] = [
  { id: 'cash', icon: Banknote },
  { id: 'card', icon: CreditCard },
  { id: 'payme_click', icon: Wallet },
];

export function PaymentMethods({ available }: { available: PaymentMethod[] }) {
  const { paymentMethod, setPaymentMethod } = useCart();
  const { t } = useI18n();
  const { haptic } = useTelegram();

  return (
    <div className="divide-y divide-line overflow-hidden rounded-[20px] bg-surface" role="radiogroup" aria-label={t('cart.payment')}>
      {METHODS.filter(({ id }) => available.includes(id)).map(({ id, icon: Icon }) => {
        const selected = paymentMethod === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => {
              haptic.select();
              setPaymentMethod(id);
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-200"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-tile text-ink">
              <Icon size={20} strokeWidth={1.9} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-medium">{t(`cart.methods.${id}`)}</span>
              <span className="block text-[13px] text-ink-2">{t(`cart.methods.${id}Hint`)}</span>
            </span>
            <span
              aria-hidden="true"
              className={cn(
                'flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200',
                selected ? 'border-brand bg-brand text-on-brand' : 'border-line',
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
