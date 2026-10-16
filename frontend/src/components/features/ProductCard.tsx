'use client';

/**
 * Mahsulot kartochkasi: oq karta, kulrang fondagi surat, narx (chegirmada qizil + chizilgan eski narx),
 * nomi va tezkor "+" tugmasi. "+" bosilganda o'sha joyning o'zida "− 1 +" boshqaruviga aylanadi.
 */
import { Plus } from 'lucide-react';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { useCart } from '@/hooks/useCart';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import { cn, discountPercent, formatPrice } from '@/lib/utils';
import { useUiStore } from '@/store/uiStore';
import type { Product } from '@/types';

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const { t, pick } = useI18n();
  const { haptic } = useTelegram();
  const { add, increment, decrement, quantityOf } = useCart();
  const openProduct = useUiStore((state) => state.openProduct);
  const quantity = quantityOf(product.id);
  const discount = discountPercent(product.price, product.oldPrice);
  const name = pick(product.name);

  return (
    <article className={cn('relative flex flex-col rounded-[20px] bg-surface p-1.5 pb-3', className)}>
      <button
        type="button"
        onClick={() => {
          haptic.impact('light');
          openProduct(product);
        }}
        className="flex flex-1 flex-col rounded-[16px] text-left"
        aria-label={name}
      >
        <div className="relative aspect-square overflow-hidden rounded-[16px] bg-tile">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image} alt="" loading="lazy" className="size-full object-cover" />
          {discount > 0 && (
            <span className="price absolute top-2 left-2 rounded-[8px] bg-sale px-1.5 py-0.5 text-[12px] font-semibold text-white">
              −{discount}%
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col px-1.5 pt-2.5">
          <p className="price flex flex-wrap items-baseline gap-x-1.5 leading-tight">
            <span className={cn('text-[17px] font-semibold whitespace-nowrap', discount > 0 ? 'text-sale' : 'text-ink')}>
              {formatPrice(product.price)} <span className="text-[13px] font-medium">{t('common.currency')}</span>
            </span>
            {product.oldPrice && <span className="text-[13px] text-ink-2 line-through">{formatPrice(product.oldPrice)}</span>}
          </p>
          <h3 className="mt-1 line-clamp-2 min-h-[2.6em] text-[14px] leading-[1.3] text-ink">{name}</h3>
        </div>
      </button>

      {/* "+" va qadam boshqaruvi suratning pastki o'ng burchagida */}
      <div className="pointer-events-none absolute inset-x-1.5 top-1.5 flex aspect-square items-end justify-end p-2">
        {quantity === 0 ? (
          <button
            type="button"
            aria-label={t('common.addToCartItem', { name })}
            onClick={(event) => {
              event.stopPropagation();
              haptic.impact('medium');
              add(product);
            }}
            className="pointer-events-auto flex size-10 items-center justify-center rounded-full bg-surface text-ink shadow-(--shadow-thumb) transition-transform duration-150 active:scale-90"
          >
            <Plus size={20} strokeWidth={2.25} />
          </button>
        ) : (
          <QuantityStepper
            size="md"
            tone="brand"
            label={name}
            value={quantity}
            className="pointer-events-auto animate-pop-in shadow-(--shadow-thumb)"
            onIncrement={() => {
              haptic.impact('light');
              increment(product.id);
            }}
            onDecrement={() => {
              haptic.impact('light');
              decrement(product.id);
            }}
          />
        )}
      </div>
    </article>
  );
}
