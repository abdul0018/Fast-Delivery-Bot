'use client';

/** Order Stack: savatchadagi mahsulotlar ro'yxati */
import { X } from 'lucide-react';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { useCart } from '@/hooks/useCart';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import { formatPrice } from '@/lib/utils';

export function CartList() {
  const { items, increment, decrement, remove } = useCart();
  const { pick, price } = useI18n();
  const { haptic } = useTelegram();

  return (
    <ul className="divide-y-2 divide-hair overflow-hidden rounded-[26px] border-2 border-outline bg-surface">
      {items.map(({ product, quantity }) => {
        const name = pick(product.name);
        return (
          <li key={product.id} className="flex gap-3 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.image} alt="" className="size-[76px] shrink-0 rounded-[18px] border-2 border-outline bg-muted object-cover" />

            <div className="flex min-w-0 flex-1 flex-col justify-between">
              <div className="flex items-start justify-between gap-2">
                <h3 className="line-clamp-2 text-[15px] leading-tight font-extrabold tracking-normal">{name}</h3>
                <button
                  type="button"
                  aria-label={`${name} ×`}
                  onClick={() => {
                    haptic.impact('rigid');
                    remove(product.id);
                  }}
                  className="-mt-1.5 -mr-1.5 flex size-8 shrink-0 items-center justify-center rounded-full text-ink-2 hover:bg-muted"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
              </div>

              <div className="flex items-end justify-between gap-2">
                <div>
                  {product.oldPrice && (
                    <p className="price text-xs font-medium text-ink-2 line-through">{formatPrice(product.oldPrice * quantity)}</p>
                  )}
                  <p className="price text-[17px] font-black text-sale">{price(product.price * quantity)}</p>
                </div>
                <QuantityStepper
                  size="sm"
                  label={name}
                  value={quantity}
                  onIncrement={() => {
                    haptic.impact('light');
                    increment(product.id);
                  }}
                  onDecrement={() => {
                    haptic.impact('light');
                    decrement(product.id);
                  }}
                />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
