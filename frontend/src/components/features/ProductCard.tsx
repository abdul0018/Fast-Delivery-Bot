'use client';

/**
 * Mahsulot kartochkasi: rasm, nom, eski narx (chizilgan), yangi narx (qizil) va tezkor "+" tugmasi.
 * Kartochka bosilsa — Bottom Sheet ochiladi; "+" bosilsa — sahifadan chiqmasdan savatchaga qo'shiladi
 * (savatchadagi soni rasm burchagida ko'rinadi).
 */
import type { MouseEvent } from 'react';
import { useCart } from '@/hooks/useCart';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import { cn, discountPercent, formatPrice } from '@/lib/utils';
import { useUiStore } from '@/store/uiStore';
import type { Product } from '@/types';

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const { t, pick } = useI18n();
  const { haptic } = useTelegram();
  const { add, quantityOf } = useCart();
  const openProduct = useUiStore((state) => state.openProduct);
  const quantity = quantityOf(product.id);
  const discount = discountPercent(product.price, product.oldPrice);

  const quickAdd = (event: MouseEvent) => {
    event.stopPropagation();
    haptic.impact('medium');
    add(product);
  };

  return (
    <article
      onClick={() => {
        haptic.impact('light');
        openProduct(product);
      }}
      className={cn(
        'group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl bg-surface p-2 shadow-sm transition active:scale-[0.98]',
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden rounded-[20px] bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={pick(product.name)} loading="lazy" className="size-full object-cover" />
        {quantity > 0 && (
          <span
            key={quantity}
            className="absolute top-2 right-2 flex h-7 min-w-7 animate-pop items-center justify-center rounded-full bg-brand px-2 text-sm font-bold text-white shadow-lg"
          >
            {quantity}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-2 left-2 rounded-full bg-sale px-2 py-0.5 text-[11px] font-bold text-white">
            −{discount}%
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-1.5 pt-2.5 pb-1">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-[15px] leading-tight font-semibold">{pick(product.name)}</h3>

        <div className="mt-2 flex items-end justify-between gap-1">
          <div className="min-w-0">
            {product.oldPrice && (
              <p className="text-xs text-hint line-through">{formatPrice(product.oldPrice)}</p>
            )}
            <p className="text-base leading-tight font-extrabold text-sale">
              {formatPrice(product.price)} <span className="text-xs font-semibold">{t('common.currency')}</span>
            </p>
          </div>

          <button
            type="button"
            aria-label="+"
            onClick={quickAdd}
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand text-xl font-bold text-white shadow-md shadow-brand/30 transition active:scale-90"
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
}
