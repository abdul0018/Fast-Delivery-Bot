'use client';

import { Check } from 'lucide-react';
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
        <div className="px-4 pt-6 pb-6">
          <div className="flex flex-col items-center rounded-[28px] bg-brand-fill px-6 pt-8 pb-6 text-center text-on-brand">
            <span className="flex size-[72px] animate-stamp items-center justify-center rounded-full border-[3px] border-on-brand bg-accent text-on-accent">
              <Check size={38} strokeWidth={3} />
            </span>
            <h2 className="shout mt-4 text-[30px]">{t('cart.successTitle')}</h2>
          </div>
          <div className="px-2 pt-5 text-center">
            <p className="text-[15px] font-medium text-ink-2">
              {order.paymentStatus === 'paid' ? t('cart.paidText', { id: order.id }) : t('cart.successText', { id: order.id })}
            </p>
            <p className="price mt-3 text-[32px] font-black">{price(order.total)}</p>
          </div>
        </div>
      )}
    </BottomSheet>
  );
}
