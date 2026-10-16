'use client';

/** Order Stack: bitta oq karta ichida savatchadagi mahsulotlar, har birida surat, nom, narx va boshqaruv */
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { useCart } from '@/hooks/useCart';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import { cn, formatPrice } from '@/lib/utils';

export function CartList() {
  const { items, increment, decrement } = useCart();
  const { pick, price } = useI18n();
  const { haptic } = useTelegram();

  return (
    <ul className="divide-y divide-line overflow-hidden rounded-[20px] bg-surface">
      {items.map(({ product, quantity }) => {
        const name = pick(product.name);
        const discounted = Boolean(product.oldPrice && product.oldPrice > product.price);
        return (
          <li key={product.id} className="flex animate-rise items-center gap-3 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.image} alt="" className="size-[68px] shrink-0 rounded-[14px] bg-tile object-cover" />
            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-2 text-[15px] leading-tight">{name}</h3>
              <p className="price mt-1.5 flex flex-wrap items-baseline gap-x-1.5">
                <span className={cn('text-[15px] font-semibold', discounted && 'text-sale')}>{price(product.price * quantity)}</span>
                {discounted && (
                  <span className="text-[12px] text-ink-2 line-through">{formatPrice((product.oldPrice ?? 0) * quantity)}</span>
                )}
              </p>
            </div>
            <QuantityStepper
              size="sm"
              removeAtOne
              label={name}
              value={quantity}
              onIncrement={() => {
                haptic.impact('light');
                increment(product.id);
              }}
              onDecrement={() => {
                haptic.impact(quantity === 1 ? 'rigid' : 'light');
                decrement(product.id);
              }}
            />
          </li>
        );
      })}
    </ul>
  );
}
