'use client';

/** Buyurtma qabul qilinganda — to'liq ekran: brend rangidagi belgi, "Rahmat!", buyurtma raqami va summa */
import { createPortal } from 'react-dom';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/hooks/useI18n';
import type { Order } from '@/types';

export function OrderSuccess({ order, onClose }: { order: Order | null; onClose: () => void }) {
  const { t, price } = useI18n();
  if (!order || typeof document === 'undefined') return null;

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={t('cart.successTitle')} className="fixed inset-0 z-[70] mx-auto flex max-w-lg animate-fade-in flex-col bg-ground">
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <span className="flex size-24 animate-pop-in items-center justify-center rounded-full bg-brand text-on-brand">
          <Check size={46} strokeWidth={2.5} />
        </span>
        <h2 className="mt-7 text-[40px] leading-none font-semibold tracking-[-0.03em]">{t('cart.thanks')}</h2>
        <p className="mt-3 text-[17px]">{t('cart.onTheWay')}</p>
        <p className="mt-1.5 max-w-[30ch] text-[15px] text-ink-2">
          {order.paymentStatus === 'paid' ? t('cart.paidText', { id: order.id }) : t('cart.successText', { id: order.id })}
        </p>

        <dl className="mt-8 w-full divide-y divide-line rounded-[20px] bg-surface text-[15px]">
          <div className="flex items-center justify-between px-4 py-3.5">
            <dt className="text-ink-2">{t('cart.orderNumber')}</dt>
            <dd className="price font-semibold">#{order.id}</dd>
          </div>
          <div className="flex items-center justify-between px-4 py-3.5">
            <dt className="text-ink-2">{t('cart.total')}</dt>
            <dd className="price text-[17px] font-semibold">{price(order.total)}</dd>
          </div>
        </dl>
      </div>
      <div className="px-4 pb-safe">
        <Button size="lg" fullWidth className="mb-3" onClick={onClose}>
          {t('cart.backHome')}
        </Button>
      </div>
    </div>,
    document.body,
  );
}
