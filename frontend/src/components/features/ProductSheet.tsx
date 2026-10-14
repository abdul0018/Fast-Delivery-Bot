'use client';

/**
 * Mahsulot tafsilotlari — alohida sahifa emas, pastdan chiquvchi Bottom Sheet.
 * Katta rasm, tarkibi (bullet), xavfni yopuvchi blok va pastga yopishgan "Savatchaga qo'shish — narx" tugmasi.
 */
import { useEffect, useState } from 'react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { useCart } from '@/hooks/useCart';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import { discountPercent, formatPrice } from '@/lib/utils';
import { useUiStore } from '@/store/uiStore';
import type { Product } from '@/types';

const TRUST_ITEMS = [
  { icon: '✅', key: 'product.trustHalal' },
  { icon: '⚡', key: 'product.trustFast' },
  { icon: '🥬', key: 'product.trustFresh' },
] as const;

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
    <div>
      <div className="relative aspect-[4/3] w-full bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={pick(product.name)} className="size-full object-cover" />
        {discount > 0 && (
          <span className="absolute bottom-3 left-4 rounded-full bg-sale px-3 py-1 text-sm font-bold text-white shadow-lg">
            −{discount}%
          </span>
        )}
      </div>

      <div className="space-y-5 px-5 pt-5 pb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-2xl leading-tight font-extrabold">{pick(product.name)}</h2>
            <p className="mt-1.5 text-[15px] text-hint">{pick(product.description)}</p>
          </div>
          <div className="shrink-0 text-right">
            {product.oldPrice && <p className="text-sm text-hint line-through">{formatPrice(product.oldPrice)}</p>}
            <p className="text-xl font-extrabold whitespace-nowrap text-sale">{formatPrice(product.price)}</p>
            <p className="text-xs text-hint">{t('common.currency')}</p>
          </div>
        </div>

        {/* Tarkibi */}
        {pick(product.ingredients).length > 0 && (
          <section>
            <h3 className="mb-2 text-base font-bold">{t('product.ingredients')}</h3>
            <ul className="space-y-1.5">
              {pick(product.ingredients).map((ingredient) => (
                <li key={ingredient} className="flex items-center gap-2.5 text-[15px]">
                  <span className="size-1.5 shrink-0 rounded-full bg-brand" />
                  {ingredient}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Xavfni yopuvchi (risk reversal) blok */}
        <section className="grid gap-2 rounded-2xl bg-success/10 p-3">
          {TRUST_ITEMS.map((item) => (
            <div key={item.key} className="flex items-center gap-2.5 text-sm font-semibold text-success">
              <span className="text-base">{item.icon}</span>
              {t(item.key)}
            </div>
          ))}
        </section>

        <div className="flex items-center justify-between">
          <span className="text-base font-semibold">×{quantity}</span>
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
