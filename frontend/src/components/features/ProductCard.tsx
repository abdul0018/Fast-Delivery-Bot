'use client';

/**
 * Mahsulot kartochkasi: rasm, nom, eski narx (chizilgan), yangi narx (qizil) va tezkor "+" tugmasi.
 * Kartochka bosilsa — Bottom Sheet ochiladi; "+" bosilsa — sahifadan chiqmasdan savatchaga qo'shiladi
 * (savatchadagi soni rasm burchagida ko'rinadi).
 */
import type { MouseEvent } from 'react';
import { Plus } from 'lucide-react';
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
  const name = pick(product.name);

  const quickAdd = (event: MouseEvent) => {
    event.stopPropagation();
    haptic.impact('medium');
    add(product);
  };

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-[20px] bg-surface shadow-[0_1px_2px_rgba(23,20,42,0.06),0_8px_24px_-16px_rgba(23,20,42,0.25)]',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => {
          haptic.impact('light');
          openProduct(product);
        }}
        className="flex flex-1 flex-col text-left"
        aria-label={name}
      >
        <div className="relative aspect-square overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt=""
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 ease-silk group-active:scale-[1.03]"
          />
          {discount > 0 && (
            <span className="price absolute top-2.5 left-2.5 rounded-[8px] bg-silk-3 px-1.5 py-0.5 text-[12px] font-bold text-on-silk-3">
              −{discount}%
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col px-3 pt-2.5 pb-3">
          <h3 className="line-clamp-2 min-h-[2.5em] font-sans text-[15px] leading-tight font-semibold tracking-normal">
            {name}
          </h3>
          <div className="mt-1.5 pr-10">
            {product.oldPrice ? (
              <p className="price text-[12px] text-ink-2 line-through decoration-[1.5px]">{formatPrice(product.oldPrice)}</p>
            ) : (
              <p className="text-[12px]">&nbsp;</p>
            )}
            <p className="price text-[17px] leading-tight font-bold text-sale">
              {formatPrice(product.price)} <span className="text-[12px] font-semibold">{t('common.currency')}</span>
            </p>
          </div>
        </div>
      </button>

      <button
        type="button"
        aria-label={`${t('nav.cart')}: ${name}`}
        onClick={quickAdd}
        className="absolute right-2.5 bottom-3 flex size-10 items-center justify-center rounded-[12px] bg-brand text-on-brand shadow-[0_6px_14px_-8px_var(--brand)] transition-transform duration-150 active:scale-90"
      >
        <Plus size={20} strokeWidth={2.25} />
      </button>

      {quantity > 0 && (
        <span
          key={quantity}
          aria-label={`× ${quantity}`}
          className="price absolute top-2.5 right-2.5 flex h-7 min-w-7 animate-badge items-center justify-center rounded-full bg-brand px-2 text-sm font-bold text-on-brand ring-2 ring-surface"
        >
          {quantity}
        </span>
      )}
    </article>
  );
}
