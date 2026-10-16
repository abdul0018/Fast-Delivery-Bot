'use client';

/**
 * Mahsulot kartochkasi (namunadagi "Popular" kartasi): och kulrang karta, rasm, nom,
 * eski narx (chizilgan), yangi narx (qizil) va kichik yashil dumaloq "+" tugmasi.
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
    <article className={cn('relative flex flex-col rounded-[22px] bg-surface p-2.5', className)}>
      <button
        type="button"
        onClick={() => {
          haptic.impact('light');
          openProduct(product);
        }}
        className="flex flex-1 flex-col text-left"
        aria-label={name}
      >
        <div className="relative aspect-square overflow-hidden rounded-[16px] bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image} alt="" loading="lazy" className="size-full object-cover" />
          {discount > 0 && (
            <span className="price absolute top-2 left-2 rounded-full bg-brand-fill px-2 py-0.5 text-[11px] font-bold text-on-brand">
              −{discount}%
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col px-1 pt-2.5">
          <h3 className="line-clamp-2 min-h-[2.5em] text-[15px] leading-tight font-bold">{name}</h3>
          <div className="mt-1 pr-10">
            {product.oldPrice ? (
              <p className="price text-[12px] font-medium text-ink-2 line-through">{formatPrice(product.oldPrice)}</p>
            ) : (
              <p className="text-[12px]">&nbsp;</p>
            )}
            <p className="price text-[16px] leading-tight font-extrabold whitespace-nowrap text-sale">
              {formatPrice(product.price)} <span className="text-[11px] font-semibold text-ink-2">{t('common.currency')}</span>
            </p>
          </div>
        </div>
      </button>

      <button
        type="button"
        aria-label={t('common.addToCartItem', { name })}
        onClick={quickAdd}
        className="absolute right-2.5 bottom-2.5 flex size-8 items-center justify-center rounded-full bg-accent text-on-accent transition-transform duration-150 active:scale-90"
      >
        <Plus size={18} strokeWidth={2.75} />
      </button>

      {quantity > 0 && (
        <span
          key={quantity}
          aria-label={`× ${quantity}`}
          className="price absolute top-4 right-4 flex size-7 animate-pop-in items-center justify-center rounded-full bg-brand-fill text-[13px] font-bold text-on-brand ring-2 ring-white"
        >
          {quantity}
        </span>
      )}
    </article>
  );
}
