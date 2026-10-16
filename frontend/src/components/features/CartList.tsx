'use client';

/** Order Stack (namunadagi savatcha): kulrang kartalar, dumaloq rasm, nom, qizil narx, ustma-ust qizil +/- tugmalar */
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { useCart } from '@/hooks/useCart';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import { formatPrice } from '@/lib/utils';

export function CartList() {
  const { items, increment, decrement } = useCart();
  const { pick, price } = useI18n();
  const { haptic } = useTelegram();

  return (
    <ul className="space-y-2.5">
      {items.map(({ product, quantity }) => {
        const name = pick(product.name);
        return (
          <li key={product.id} className="flex items-center gap-3 rounded-[20px] bg-surface p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.image} alt="" className="size-[64px] shrink-0 rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-2 text-[15px] leading-tight font-bold">{name}</h3>
              {product.oldPrice && (
                <p className="price mt-1 text-xs font-medium text-ink-2 line-through">{formatPrice(product.oldPrice * quantity)}</p>
              )}
              <p className="price text-[16px] font-extrabold text-sale">{price(product.price * quantity)}</p>
            </div>
            <QuantityStepper
              size="sm"
              orientation="vertical"
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
