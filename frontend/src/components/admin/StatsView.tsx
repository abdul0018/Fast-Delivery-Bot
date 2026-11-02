'use client';

/**
 * Statistika: tushum (asosiy raqam) va o'tgan davr bilan taqqoslash, kunlik tushum grafigi,
 * buyurtmalar / o'rtacha chek / mijozlar, eng ko'p sotilgan mahsulotlar va holatlar bo'yicha taqsimot.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, BellRing, ChevronRight, RefreshCw } from 'lucide-react';
import { adminApi, adminErrorText, type AdminStats } from '@/lib/adminApi';
import { cn, formatPrice } from '@/lib/utils';
import type { OrderStatus } from '@/types';
import { Chips, ListSkeleton, STATUS_LABELS, compactSom, som, useAdminToast } from './adminUi';

type Period = '7' | '30' | '90';
const PERIODS: { value: Period; label: string }[] = [
  { value: '7', label: '7 дней' },
  { value: '30', label: '30 дней' },
  { value: '90', label: '90 дней' },
];

const MONTHS = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
const dayLabel = (iso: string) => {
  const [, month, day] = iso.split('-').map(Number);
  return `${day} ${MONTHS[month - 1]}`;
};

const plural = (count: number, [one, few, many]: [string, string, string]) => {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
};
const ordersWord = (count: number) => `${count} ${plural(count, ['заказ', 'заказа', 'заказов'])}`;

interface Bar {
  key: string;
  label: string;
  revenue: number;
  orders: number;
}

/** 90 kun — haftalarga guruhlanadi (telefonda 90 ta ustun juda ingichka) */
function toBars(daily: AdminStats['daily'], days: number): Bar[] {
  if (days < 90) {
    return daily.map((day) => ({ key: day.date, label: dayLabel(day.date), revenue: day.revenue, orders: day.orders }));
  }
  const bars: Bar[] = [];
  for (let index = daily.length; index > 0; index -= 7) {
    const week = daily.slice(Math.max(0, index - 7), index);
    bars.unshift({
      key: week[0].date,
      label: `${dayLabel(week[0].date)} – ${dayLabel(week[week.length - 1].date)}`,
      revenue: week.reduce((sum, day) => sum + day.revenue, 0),
      orders: week.reduce((sum, day) => sum + day.orders, 0),
    });
  }
  return bars;
}

function Delta({ current, previous }: { current: number; previous: number }) {
  if (!previous) return <span className="text-[13px] text-ink-2">нет данных за прошлый период</span>;
  const change = Math.round(((current - previous) / previous) * 100);
  const up = change >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={cn('inline-flex items-center gap-0.5 text-[13px] font-medium', up ? 'text-ok' : 'text-sale')}>
      <Icon size={15} strokeWidth={2.4} />
      {up ? '+' : '−'}
      {Math.abs(change)}% к прошлому периоду
    </span>
  );
}

function RevenueChart({ bars, unit }: { bars: Bar[]; unit: string }) {
  const [selected, setSelected] = useState(bars.length - 1);
  useEffect(() => setSelected(bars.length - 1), [bars]);

  const max = Math.max(...bars.map((bar) => bar.revenue), 1);
  const active = bars[selected] ?? bars[bars.length - 1];
  const middle = Math.floor((bars.length - 1) / 2);

  return (
    <section className="rounded-[20px] bg-surface p-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-[17px] font-semibold">Выручка {unit}</h2>
        <span className="text-[12px] text-ink-2">нажмите на столбец</span>
      </div>
      {/* Tanlangan ustun ma'lumoti (tooltip o'rniga — telefonda doim ko'rinadi) */}
      <p className="mt-2 min-h-[22px] text-[14px]" aria-live="polite">
        <span className="text-ink-2">{active.label}:</span>{' '}
        <span className="price font-semibold">{som(active.revenue)}</span>
        <span className="text-ink-2"> · {ordersWord(active.orders)}</span>
      </p>

      <div className="relative mt-3">
        <span className="price absolute -top-0.5 left-0 text-[11px] text-ink-2">{compactSom(max)}</span>
        <div className="flex h-[150px] items-end gap-[2px] border-b border-line pt-5" role="list" aria-label="Выручка по дням">
          {bars.map((bar, index) => (
            <button
              key={bar.key}
              type="button"
              role="listitem"
              aria-label={`${bar.label}: ${som(bar.revenue)}, ${ordersWord(bar.orders)}`}
              aria-pressed={index === selected}
              onClick={() => setSelected(index)}
              className="group flex h-full min-w-0 flex-1 items-end"
            >
              <span
                className={cn(
                  'w-full rounded-t-[4px] bg-brand transition-opacity duration-200',
                  index === selected ? 'opacity-100' : 'opacity-35 group-hover:opacity-60',
                )}
                style={{ height: bar.revenue ? `${Math.max((bar.revenue / max) * 100, 3)}%` : '0%' }}
              />
            </button>
          ))}
        </div>
        <div className="mt-1.5 flex justify-between text-[11px] text-ink-2">
          <span>{bars[0]?.label.split(' – ')[0]}</span>
          {bars.length > 4 && <span>{bars[middle]?.label.split(' – ')[0]}</span>}
          <span>{bars[bars.length - 1]?.label.split(' – ')[0]}</span>
        </div>
      </div>
    </section>
  );
}

function Tile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-[20px] bg-surface p-4">
      <p className="text-[13px] text-ink-2">{label}</p>
      <p className="price mt-1 text-[22px] leading-tight font-semibold tracking-[-0.01em]">{value}</p>
      {hint && <p className="mt-0.5 text-[12px] text-ink-2">{hint}</p>}
    </div>
  );
}

const STATUS_ORDER: OrderStatus[] = ['new', 'confirmed', 'delivering', 'completed', 'cancelled'];

export function StatsView({ onOpenOrders }: { onOpenOrders: () => void }) {
  const toast = useAdminToast();
  const [period, setPeriod] = useState<Period>('30');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(
    async (days: Period) => {
      setLoading(true);
      try {
        setStats(await adminApi.getStats(Number(days)));
      } catch (error) {
        toast(adminErrorText(error), 'error');
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  useEffect(() => {
    load(period);
  }, [load, period]);

  const bars = useMemo(() => (stats ? toBars(stats.daily, stats.days) : []), [stats]);
  const s = stats?.summary;
  const topMax = Math.max(...(stats?.topProducts.map((product) => product.revenue) ?? [1]), 1);
  const statusTotal = stats ? Object.values(stats.statuses).reduce((sum, count) => sum + (count ?? 0), 0) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <Chips label="Период" options={PERIODS} value={period} onChange={setPeriod} />
        </div>
        <button
          type="button"
          onClick={() => load(period)}
          aria-label="Обновить"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface text-ink-2"
        >
          <RefreshCw size={16} className={cn(loading && 'animate-spin')} />
        </button>
      </div>

      {!stats || !s ? (
        <ListSkeleton rows={4} height="h-28" />
      ) : (
        <>
          {s.pending > 0 && (
            <button
              type="button"
              onClick={onOpenOrders}
              className="flex w-full items-center gap-3 rounded-[20px] bg-brand p-4 text-left text-on-brand"
            >
              <BellRing size={22} />
              <span className="flex-1 text-[15px] font-semibold">
                {s.pending} {plural(s.pending, ['новый заказ ждёт', 'новых заказа ждут', 'новых заказов ждут'])} подтверждения
              </span>
              <ChevronRight size={20} />
            </button>
          )}

          {/* Asosiy raqam */}
          <section className="rounded-[20px] bg-surface p-4">
            <p className="text-[13px] text-ink-2">Выручка за {stats.days} дней</p>
            <p className="price mt-1 text-[34px] leading-none font-semibold tracking-[-0.02em]">
              {formatPrice(s.revenue)} <span className="text-[20px] text-ink-2">сум</span>
            </p>
            <p className="mt-2">
              <Delta current={s.revenue} previous={s.previousRevenue} />
            </p>
            <p className="mt-3 border-t border-line pt-3 text-[14px]">
              <span className="text-ink-2">Сегодня:</span> <span className="price font-semibold">{som(s.todayRevenue)}</span>
              <span className="text-ink-2"> · {ordersWord(s.todayOrders)}</span>
            </p>
          </section>

          <RevenueChart bars={bars} unit={stats.days === 90 ? 'по неделям' : 'по дням'} />

          <div className="grid grid-cols-2 gap-2.5">
            <Tile label="Заказы" value={String(s.orders)} hint={s.cancelled ? `из них отменено ${s.cancelled}` : 'без отмен'} />
            <Tile label="Средний чек" value={compactSom(s.averageCheck)} hint={som(s.averageCheck)} />
            <Tile label="Покупатели" value={String(s.customers)} hint="сделали заказ" />
            <Tile label="Новые в боте" value={String(s.newUsers)} hint={`всего ${s.totalUsers}`} />
          </div>

          <section className="rounded-[20px] bg-surface p-4">
            <h2 className="text-[17px] font-semibold">Популярные товары</h2>
            {stats.topProducts.length === 0 ? (
              <p className="mt-2 text-[14px] text-ink-2">За этот период продаж ещё нет.</p>
            ) : (
              <ol className="mt-3 space-y-3.5">
                {stats.topProducts.map((product) => (
                  <li key={product.productId}>
                    <div className="flex items-baseline justify-between gap-3 text-[14px]">
                      <span className="min-w-0 truncate font-medium">{product.name}</span>
                      <span className="price shrink-0 font-semibold">{compactSom(product.revenue)}</span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-tile">
                        <div
                          className="h-full rounded-full bg-brand"
                          style={{ width: `${Math.max((product.revenue / topMax) * 100, 2)}%` }}
                        />
                      </div>
                      <span className="price w-14 shrink-0 text-right text-[12px] text-ink-2">{product.quantity} шт</span>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section className="rounded-[20px] bg-surface p-4">
            <h2 className="text-[17px] font-semibold">Заказы по статусам</h2>
            <dl className="mt-2 divide-y divide-line">
              {STATUS_ORDER.map((status) => (
                <div key={status} className="flex items-center justify-between py-2.5 text-[15px]">
                  <dt className="text-ink-2">{STATUS_LABELS[status]}</dt>
                  <dd className="price font-semibold">
                    {stats.statuses[status] ?? 0}
                    {statusTotal > 0 && (
                      <span className="ml-2 text-[12px] font-normal text-ink-2">
                        {Math.round(((stats.statuses[status] ?? 0) / statusTotal) * 100)}%
                      </span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </>
      )}
    </div>
  );
}
