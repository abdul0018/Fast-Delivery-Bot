'use client';

import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/hooks/useI18n';
import type { Order } from '@/types';

/** Buyurtma muvaffaqiyatli qabul qilinganda ko'rsatiladigan panel */
export function OrderSuccess({ order, onClose }: { order: Order | null; onClose: () => void }) {
  const { t, price } = useI18n();

  return (
    <BottomSheet
      open={Boolean(order)}
      onClose={onClose}
      footer={
        <Button size="lg" fullWidth className="mb-1" onClick={onClose}>
          {t('cart.backHome')}
        </Button>
      }
    >
      {order && (
        <div className="flex flex-col items-center px-6 pt-10 pb-6 text-center">
          <div className="flex size-24 animate-pop items-center justify-center rounded-full bg-success/15 text-5xl">✅</div>
          <h2 className="mt-5 text-2xl font-extrabold">{t('cart.successTitle')}</h2>
          <p className="mt-2 text-[15px] text-hint">
            {order.paymentStatus === 'paid' ? t('cart.paidText', { id: order.id }) : t('cart.successText', { id: order.id })}
          </p>
          <p className="mt-4 rounded-full bg-muted px-4 py-2 text-lg font-bold">{price(order.total)}</p>
        </div>
      )}
    </BottomSheet>
  );
}
