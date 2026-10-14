'use client';

import { Check } from 'lucide-react';
import { AtlasBand } from '@/components/ui/AtlasBand';
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
        <div>
          <div className="silk-field flex flex-col items-center px-6 pt-10 pb-4 text-center">
            <span className="flex size-16 animate-badge items-center justify-center rounded-full bg-on-brand text-brand">
              <Check size={34} strokeWidth={2.25} />
            </span>
            <h2 className="mt-4 text-[26px] leading-tight font-bold">{t('cart.successTitle')}</h2>
          </div>
          <AtlasBand variant="edge" height={32} seed={11} />
          <div className="px-6 pt-2 pb-6 text-center">
            <p className="text-[15px] text-ink-2">
              {order.paymentStatus === 'paid' ? t('cart.paidText', { id: order.id }) : t('cart.successText', { id: order.id })}
            </p>
            <p className="price mt-4 text-[28px] font-bold">{price(order.total)}</p>
          </div>
        </div>
      )}
    </BottomSheet>
  );
}
