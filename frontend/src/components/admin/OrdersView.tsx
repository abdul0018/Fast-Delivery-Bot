'use client';

/**
 * Buyurtmalar: holat bo'yicha filtr, mijoz (Telegram, telefon), manzil + xarita, mahsulotlar,
 * holatni o'zgartirish tugmalari (mijozga Telegram'da xabar boradi).
 */
import { useCallback, useEffect, useState } from 'react';
import { ClipboardList, MapPin, MessageSquareText, Phone, RefreshCw, Send } from 'lucide-react';
import { adminApi, adminErrorText, type AdminOrder } from '@/lib/adminApi';
import { cn, formatPrice } from '@/lib/utils';
import type { OrderStatus } from '@/types';
import { Chips, EmptyState, ListSkeleton, STATUS_ACTIONS, STATUS_LABELS, som, useAdminToast } from './adminUi';

type Filter = 'all' | OrderStatus;
const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'new', label: 'Новые' },
  { value: 'confirmed', label: 'Готовятся' },
  { value: 'delivering', label: 'В пути' },
  { value: 'completed', label: 'Доставлены' },
  { value: 'cancelled', label: 'Отменены' },
];
const PAGE = 20;

const STATUS_STYLE: Record<OrderStatus, string> = {
  new: 'bg-brand text-on-brand',
  confirmed: 'bg-brand-soft text-brand-ink',
  delivering: 'bg-brand-soft text-brand-ink',
  completed: 'bg-tile text-ink-2',
  cancelled: 'bg-tile text-ink-2 line-through',
};

const formatTime = (iso: string) => {
  const date = new Date(iso);
  const today = new Date();
  const time = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  if (date.toDateString() === today.toDateString()) return `сегодня, ${time}`;
  return `${date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}, ${time}`;
};

function OrderCard({ order, onChange }: { order: AdminOrder; onChange: (order: AdminOrder) => void }) {
  const toast = useAdminToast();
  const [busy, setBusy] = useState<OrderStatus | null>(null);

  const changeStatus = async (status: OrderStatus) => {
    if (status === 'cancelled' && !window.confirm(`Отменить заказ №${order.id}? Покупатель получит уведомление.`)) return;
    setBusy(status);
    try {
      const updated = await adminApi.updateOrderStatus(order.id, status);
      onChange({ ...order, ...updated, customer: order.customer, phone: order.phone, comment: order.comment });
      toast(`Заказ №${order.id}: ${STATUS_LABELS[status].toLowerCase()}`);
    } catch (error) {
      toast(adminErrorText(error), 'error');
    } finally {
      setBusy(null);
    }
  };

  const mapUrl =
    order.latitude != null && order.longitude != null
      ? `https://yandex.uz/maps/?pt=${order.longitude},${order.latitude}&z=17&l=map`
      : null;
  const customer = order.customer;

  return (
    <article className="rounded-[20px] bg-surface p-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[17px] font-semibold">Заказ №{order.id}</h3>
          <p className="text-[13px] text-ink-2">{formatTime(order.createdAt)}</p>
        </div>
        <span className={cn('shrink-0 rounded-full px-2.5 py-1 text-[12px] font-semibold', STATUS_STYLE[order.status])}>
          {STATUS_LABELS[order.status]}
        </span>
      </header>

      <ul className="mt-3 space-y-1.5 border-t border-line pt-3 text-[14px]">
        {order.items.map((item) => (
          <li key={item.productId} className="flex justify-between gap-3">
            <span className="min-w-0">
              {item.nameRu}
              <span className="text-ink-2">
                {' '}
                × {item.quantity}
                {item.unitRu ? ` (${item.unitRu})` : ''}
              </span>
            </span>
            <span className="price shrink-0">{formatPrice(item.price * item.quantity)}</span>
          </li>
        ))}
        {order.bumpPrice > 0 && (
          <li className="flex justify-between gap-3 text-ink-2">
            <span>Доп. предложение</span>
            <span className="price">{formatPrice(order.bumpPrice)}</span>
          </li>
        )}
        <li className="flex justify-between gap-3 pt-1 text-[15px] font-semibold">
          <span>Итого · наличные</span>
          <span className="price">{som(order.total)}</span>
        </li>
      </ul>

      <div className="mt-3 space-y-2 border-t border-line pt-3 text-[14px]">
        {customer && (
          <p className="flex items-center gap-2">
            <Send size={15} className="shrink-0 text-ink-2" />
            <span className="min-w-0 truncate">
              {customer.name ?? 'Покупатель'}
              {customer.username && (
                <a href={`https://t.me/${customer.username}`} target="_blank" rel="noreferrer" className="ml-1.5 font-medium text-brand">
                  @{customer.username}
                </a>
              )}
            </span>
          </p>
        )}
        {order.phone && (
          <a href={`tel:${order.phone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-2 font-medium text-brand">
            <Phone size={15} className="shrink-0" />
            {order.phone}
          </a>
        )}
        <p className="flex items-start gap-2">
          <MapPin size={15} className="mt-0.5 shrink-0 text-ink-2" />
          <span className="min-w-0">
            {order.address}
            {mapUrl && (
              <a href={mapUrl} target="_blank" rel="noreferrer" className="ml-1.5 font-medium whitespace-nowrap text-brand">
                Карта →
              </a>
            )}
          </span>
        </p>
        {order.comment && (
          <p className="flex items-start gap-2">
            <MessageSquareText size={15} className="mt-0.5 shrink-0 text-ink-2" />
            <span className="min-w-0 text-ink-2">{order.comment}</span>
          </p>
        )}
      </div>

      {order.next.length > 0 && (
        <div className="mt-4 flex gap-2">
          {order.next.map((status) => (
            <button
              key={status}
              type="button"
              disabled={busy !== null}
              onClick={() => changeStatus(status)}
              className={cn(
                'flex h-11 flex-1 items-center justify-center gap-2 rounded-[14px] text-[15px] font-semibold transition-[filter,transform] active:scale-[0.98] disabled:opacity-50',
                status === 'cancelled' ? 'bg-tile text-sale' : 'bg-brand text-on-brand',
              )}
            >
              {busy === status && <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
              {STATUS_ACTIONS[status]}
            </button>
          ))}
        </div>
      )}
    </article>
  );
}

export function OrdersView() {
  const toast = useAdminToast();
  const [filter, setFilter] = useState<Filter>('all');
  const [orders, setOrders] = useState<AdminOrder[] | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = useCallback(
    async (offset = 0) => {
      setLoading(true);
      try {
        const data = await adminApi.getOrders({ status: filter === 'all' ? undefined : filter, offset, limit: PAGE });
        setOrders((current) => (offset ? [...(current ?? []), ...data.orders] : data.orders));
        setTotal(data.total);
      } catch (error) {
        toast(adminErrorText(error), 'error');
        setOrders((current) => current ?? []);
      } finally {
        setLoading(false);
      }
    },
    [filter, toast],
  );

  useEffect(() => {
    setOrders(null);
    load(0);
  }, [load]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-[24px] font-semibold tracking-[-0.02em]">Заказы</h1>
        <button
          type="button"
          onClick={() => load(0)}
          className="flex h-10 items-center gap-1.5 rounded-[14px] bg-surface px-3.5 text-[14px] font-medium text-ink"
        >
          <RefreshCw size={16} className={cn(loading && 'animate-spin')} />
          Обновить
        </button>
      </div>

      <Chips label="Статус" options={FILTERS} value={filter} onChange={setFilter} />

      {!orders ? (
        <ListSkeleton rows={3} height="h-56" />
      ) : orders.length === 0 ? (
        <EmptyState icon={<ClipboardList size={26} />} title="Заказов нет" text={filter === 'all' ? 'Новые заказы появятся здесь' : 'С этим статусом заказов нет'} />
      ) : (
        <>
          <div className="space-y-2.5">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onChange={(updated) => setOrders((current) => (current ?? []).map((item) => (item.id === updated.id ? updated : item)))}
              />
            ))}
          </div>
          {orders.length < total && (
            <button
              type="button"
              disabled={loading}
              onClick={() => load(orders.length)}
              className="h-12 w-full rounded-[16px] bg-surface text-[15px] font-semibold disabled:opacity-50"
            >
              Показать ещё ({total - orders.length})
            </button>
          )}
        </>
      )}
    </div>
  );
}
