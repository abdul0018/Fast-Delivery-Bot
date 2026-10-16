'use client';

/**
 * Mahsulot kartochkasi: konturli oq karta, rasm, nom, eski narx (chizilgan), yangi narx (qizil)
 * va dumaloq xantal "+" tugmasi. Savatchadagi soni "muhr" bo'lib rasm burchagiga bosiladi.
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
    <article className={cn('relative flex flex-col rounded-[26px] border-2 border-outline bg-surface p-2', className)}>
      <button
        type="button"
        onClick={() => {
          haptic.impact('light');
          openProduct(product);
        }}
        className="flex flex-1 flex-col text-left"
        aria-label={name}
      >
        <div className="relative aspect-square overflow-hidden rounded-[19px] bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image} alt="" loading="lazy" className="size-full object-cover" />
          {discount > 0 && (
            <span className="price absolute top-2 left-2 rounded-full border-2 border-outline bg-accent px-2 py-0.5 text-[12px] font-black text-on-accent">
              −{discount}%
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col px-1.5 pt-2 pb-1">
          <h3 className="line-clamp-2 min-h-[2.5em] text-[15px] leading-tight font-extrabold tracking-normal">{name}</h3>
          <div className="mt-1 pr-11">
            {product.oldPrice ? (
              <p className="price text-[12px] font-medium text-ink-2 line-through decoration-[1.5px]">
                {formatPrice(product.oldPrice)}
              </p>
            ) : (
              <p className="text-[12px]">&nbsp;</p>
            )}
            <p className="price text-[18px] leading-tight font-black text-sale">
              {formatPrice(product.price)} <span className="text-[11px] font-bold">{t('common.currency')}</span>
            </p>
          </div>
        </div>
      </button>

      <button
        type="button"
        aria-label={`${t('nav.cart')}: ${name}`}
        onClick={quickAdd}
        className="absolute right-3 bottom-3 flex size-10 items-center justify-center rounded-full border-2 border-outline bg-accent text-on-accent transition-transform duration-150 active:scale-90"
      >
        <Plus size={20} strokeWidth={3} />
      </button>

      {quantity > 0 && (
        <span
          key={quantity}
          aria-label={`× ${quantity}`}
          className="price absolute top-3 right-3 flex size-9 animate-stamp items-center justify-center rounded-full border-2 border-outline bg-brand text-[15px] font-black text-on-brand"
        >
          {quantity}
        </span>
      )}
    </article>
  );
}
