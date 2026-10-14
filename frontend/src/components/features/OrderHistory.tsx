'use client';

/** Profil sahifasidagi buyurtmalar tarixi */
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { useI18n } from '@/hooks/useI18n';
import { api, canAuthenticate } from '@/lib/api';
import { cn, formatDate } from '@/lib/utils';
import type { Order, OrderStatus } from '@/types';

const STATUS_STYLES: Record<OrderStatus, string> = {
  new: 'bg-blue-500/15 text-blue-600',
  confirmed: 'bg-amber-500/15 text-amber-600',
  delivering: 'bg-violet-500/15 text-violet-600',
  completed: 'bg-success/15 text-success',
  cancelled: 'bg-sale/15 text-sale',
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

  if (!authenticated) return <p className="rounded-3xl bg-surface p-4 text-sm text-hint">{t('profile.openInTelegram')}</p>;
  if (!orders) return <Skeleton className="h-24" />;
  if (!orders.length) return <p className="rounded-3xl bg-surface p-4 text-center text-sm text-hint">{t('profile.noOrders')} 🍟</p>;

  return (
    <ul className="space-y-2">
      {orders.map((order) => {
        const names = order.items.map((line) => (lang === 'ru' ? line.nameRu : line.nameUz)).join(', ');
        const count = order.items.reduce((sum, line) => sum + line.quantity, 0);
        return (
          <li key={order.id} className="rounded-3xl bg-surface p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold">#{order.id}</span>
              <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', STATUS_STYLES[order.status])}>
                {t(`status.${order.status}`)}
              </span>
            </div>
            <p className="mt-1 line-clamp-1 text-sm text-hint">{names}</p>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-hint">
                {formatDate(order.createdAt, lang)} · {t('profile.items', { count })}
              </span>
              <span className="font-bold">{price(order.total)}</span>
            </div>
            {order.paymentMethod !== 'cash' && order.paymentStatus !== 'paid' && order.status !== 'cancelled' && (
              <p className="mt-1 text-xs font-medium text-amber-600">{t(`paymentStatus.${order.paymentStatus}`)}</p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
