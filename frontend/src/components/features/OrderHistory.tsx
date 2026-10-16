'use client';

/** Profil sahifasidagi buyurtmalar tarixi */
import { useEffect, useState } from 'react';
import { Receipt } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { useI18n } from '@/hooks/useI18n';
import { api, canAuthenticate } from '@/lib/api';
import { cn, formatDate } from '@/lib/utils';
import type { Order, OrderStatus } from '@/types';

const STATUS_STYLES: Record<OrderStatus, string> = {
  new: 'bg-brand-soft text-brand-ink',
  confirmed: 'bg-brand-soft text-brand-ink',
  delivering: 'bg-ok/10 text-ok',
  completed: 'bg-tile text-ink-2',
  cancelled: 'bg-sale/10 text-sale',
};

export function OrderHistory() {
  const { t, lang, price } = useI18n();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const authenticated = canAuthenticate();

  useEffect(() => {
    if (!authenticated) return;
    api
      .getOrders()
      .then(setOrders)
      .catch(() => setOrders([]));
  }, [authenticated]);

  if (!authenticated) return <p className="rounded-[20px] bg-surface p-4 text-[14px] text-ink-2">{t('profile.openInTelegram')}</p>;
  if (!orders) return <Skeleton className="h-24" />;
  if (!orders.length) {
    return (
      <div className="flex items-center gap-3 rounded-[20px] bg-surface p-4 text-[14px] text-ink-2">
        <Receipt size={20} strokeWidth={1.75} className="shrink-0" />
        {t('profile.noOrders')}
      </div>
    );
  }

  return (
    <ul className="divide-y divide-line overflow-hidden rounded-[20px] bg-surface">
      {orders.map((order) => {
        const names = order.items.map((line) => (lang === 'ru' ? line.nameRu : line.nameUz)).join(', ');
        const count = order.items.reduce((sum, line) => sum + line.quantity, 0);
        const awaitingPayment = order.paymentMethod !== 'cash' && order.paymentStatus !== 'paid' && order.status !== 'cancelled';
        return (
          <li key={order.id} className="px-4 py-3.5">
            <div className="flex items-center justify-between gap-2">
              <span className="price text-[15px] font-semibold">
                {t('cart.orderNumber')} #{order.id}
              </span>
              <span className={cn('rounded-full px-2.5 py-0.5 text-[12px] font-medium', STATUS_STYLES[order.status])}>
                {t(`status.${order.status}`)}
              </span>
            </div>
            <p className="mt-1 line-clamp-1 text-[14px] text-ink-2">{names}</p>
            <div className="mt-1.5 flex items-center justify-between gap-2 text-[13px]">
              <span className="price text-ink-2">
                {formatDate(order.createdAt, lang)} · {t('profile.items', { count })}
                {awaitingPayment && ` · ${t(`paymentStatus.${order.paymentStatus}`)}`}
              </span>
              <span className="price text-[15px] font-semibold text-ink">{price(order.total)}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
