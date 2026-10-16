'use client';

/**
 * Mahsulot tafsilotlari — alohida sahifa emas, pastdan chiquvchi Bottom Sheet.
 * Katta rasm, tarkibi (bullet), xavfni yopuvchi blok va pastga yopishgan "Savatchaga qo'shish — narx" tugmasi.
 */
import { useEffect, useState } from 'react';
import { Leaf, ShieldCheck, Timer } from 'lucide-react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { brand } from '@/config/brand';
import { Button } from '@/components/ui/Button';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { useCart } from '@/hooks/useCart';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import { discountPercent, formatPrice } from '@/lib/utils';
import { useUiStore } from '@/store/uiStore';
import type { Product } from '@/types';

// Faqat restoran brand.ts da tasdiqlagan va'dalar (xavfni yopuvchi blok)
const { deliveryMinutes, halal, freshDaily } = brand.promises;
const TRUST_ITEMS = [
  halal ? { icon: ShieldCheck, key: 'product.trustHalal' as const } : null,
  deliveryMinutes ? { icon: Timer, key: 'product.trustFast' as const } : null,
  freshDaily ? { icon: Leaf, key: 'product.trustFresh' as const } : null,
].filter((item) => item !== null);

export function ProductSheet() {
  const activeProduct = useUiStore((state) => state.activeProduct);
  const closeProduct = useUiStore((state) => state.closeProduct);
  // Yopilish animatsiyasi vaqtida ham kontent ko'rinib turishi uchun oxirgi mahsulotni eslab qolamiz
  const [product, setProduct] = useState<Product | null>(activeProduct);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (activeProduct) {
      setProduct(activeProduct);
      setQuantity(1);
    }
  }, [activeProduct]);

  return (
    <BottomSheet
      open={Boolean(activeProduct)}
      onClose={closeProduct}
      ariaLabel={product?.name.uz}
      footer={product && <AddToCartButton product={product} quantity={quantity} onAdded={closeProduct} />}
    >
      {product && <ProductDetails product={product} quantity={quantity} onQuantityChange={setQuantity} />}
    </BottomSheet>
  );
}

function ProductDetails({
  product,
  quantity,
  onQuantityChange,
}: {
  product: Product;
  quantity: number;
  onQuantityChange: (value: number) => void;
}) {
  const { t, pick } = useI18n();
  const { haptic } = useTelegram();
  const discount = discountPercent(product.price, product.oldPrice);

  return (
    <div className="px-4 pt-4 pb-6">
      <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[26px] border-2 border-outline bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={pick(product.name)} className="size-full object-cover" />
        {discount > 0 && (
          <span className="price absolute bottom-3 left-3 rounded-full border-2 border-outline bg-accent px-3 py-1 text-sm font-black text-on-accent">
            −{discount}%
          </span>
        )}
      </div>

      <div className="space-y-6 px-1 pt-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="shout text-[28px]">{pick(product.name)}</h2>
            <p className="mt-2 text-[15px] font-medium text-ink-2">{pick(product.description)}</p>
          </div>
          <div className="shrink-0 text-right">
            {product.oldPrice && (
              <p className="price text-sm font-medium text-ink-2 line-through decoration-[1.5px]">{formatPrice(product.oldPrice)}</p>
            )}
            <p className="price text-[26px] leading-tight font-black whitespace-nowrap text-sale">{formatPrice(product.price)}</p>
            <p className="text-xs font-bold text-ink-2">{t('common.currency')}</p>
          </div>
        </div>

        {pick(product.ingredients).length > 0 && (
          <section>
            <h3 className="shout mb-3 text-[17px]">{t('product.ingredients')}</h3>
            <ul className="space-y-2">
              {pick(product.ingredients).map((ingredient) => (
                <li key={ingredient} className="flex items-center gap-3 text-[15px] font-medium">
                  <span aria-hidden="true" className="size-3 shrink-0 rounded-full border-2 border-outline bg-accent" />
                  {ingredient}
                </li>
              ))}
            </ul>
          </section>
        )}

        {TRUST_ITEMS.length > 0 && (
          <section className="grid gap-2.5 rounded-[22px] border-2 border-outline bg-surface px-4 py-3.5">
            {TRUST_ITEMS.map(({ icon: Icon, key }) => (
              <div key={key} className="flex items-center gap-3 text-sm font-bold">
                <Icon size={19} strokeWidth={2.25} className="shrink-0 text-ok" />
                {t(key, { minutes: deliveryMinutes ?? '' })}
              </div>
            ))}
          </section>
        )}

        <div className="flex items-center justify-between">
          <span className="text-[15px] font-bold text-ink-2 uppercase">{t('product.quantity')}</span>
          <QuantityStepper
            value={quantity}
            onIncrement={() => {
              haptic.impact('light');
              onQuantityChange(Math.min(50, quantity + 1));
            }}
            onDecrement={() => {
              haptic.impact('light');
              onQuantityChange(Math.max(1, quantity - 1));
            }}
          />
        </div>
      </div>
    </div>
  );
}

/** Sticky CTA: "Savatchaga qo'shish — 64 000 so'm" */
function AddToCartButton({ product, quantity, onAdded }: { product: Product; quantity: number; onAdded: () => void }) {
  const { t, price } = useI18n();
  const { haptic } = useTelegram();
  const { add } = useCart();
  const showToast = useUiStore((state) => state.showToast);

  return (
    <Button
      size="lg"
      fullWidth
      className="mb-1"
      onClick={() => {
        add(product, quantity);
        haptic.notify('success');
        showToast(t('product.added'));
        onAdded();
      }}
    >
      {t('product.addToCart', { price: price(product.price * quantity) })}
    </Button>
  );
}
