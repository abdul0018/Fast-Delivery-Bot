'use client';

/** Buyurtma qabul qilinganda — namunadagidek to'liq qizil ekran: "Rahmat!" */
import { createPortal } from 'react-dom';
import { Logo } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/hooks/useI18n';
import type { Order } from '@/types';

export function OrderSuccess({ order, onClose }: { order: Order | null; onClose: () => void }) {
  const { t, price } = useI18n();
  if (!order || typeof document === 'undefined') return null;

  return createPortal(
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-[70] mx-auto flex max-w-lg animate-fade-in flex-col bg-brand-fill text-on-brand">
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <Logo />
        <p className="mt-10 text-[18px] font-semibold">{t('cart.onTheWay')}</p>
        <h2 className="mt-2 animate-pop-in text-[56px] leading-none font-black">{t('cart.thanks')}</h2>
        <p className="mt-5 text-[15px] font-medium opacity-90">
          {order.paymentStatus === 'paid' ? t('cart.paidText', { id: order.id }) : t('cart.successText', { id: order.id })}
        </p>
        <p className="price mt-4 text-[28px] font-extrabold">{price(order.total)}</p>
      </div>
      <div className="px-6 pb-safe">
        <Button variant="inverse" size="lg" fullWidth className="mb-3" onClick={onClose}>
          {t('cart.backHome')}
        </Button>
      </div>
    </div>,
    document.body,
  );
}
