'use client';

/**
 * Mahsulot tafsilotlari — alohida sahifa emas, pastdan chiquvchi Bottom Sheet.
 * Katta rasm, tarkibi (bullet), xavfni yopuvchi blok va pastga yopishgan "Savatchaga qo'shish — narx" tugmasi.
 */
import { useEffect, useState } from 'react';
import { Leaf, ShieldCheck, Timer } from 'lucide-react';
import { AtlasBand } from '@/components/ui/AtlasBand';
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
    <div>
      <div className="relative aspect-[5/4] w-full bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={pick(product.name)} className="size-full object-cover" />
        {discount > 0 && (
          <span className="price absolute bottom-3 left-4 rounded-[9px] bg-silk-3 px-2 py-1 text-sm font-bold text-[#17142a]">
            −{discount}%
          </span>
        )}
      </div>
      <AtlasBand variant="rail" height={12} tile={48} seed={5} />

      <div className="space-y-6 px-5 pt-5 pb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-[24px] leading-tight font-bold">{pick(product.name)}</h2>
            <p className="mt-1.5 text-[15px] text-ink-2">{pick(product.description)}</p>
          </div>
          <div className="shrink-0 text-right">
            {product.oldPrice && (
              <p className="price text-sm text-ink-2 line-through decoration-[1.5px]">{formatPrice(product.oldPrice)}</p>
            )}
            <p className="price text-[22px] leading-tight font-bold whitespace-nowrap text-sale">{formatPrice(product.price)}</p>
            <p className="text-xs text-ink-2">{t('common.currency')}</p>
          </div>
        </div>

        {pick(product.ingredients).length > 0 && (
          <section>
            <h3 className="mb-2.5 text-base font-semibold">{t('product.ingredients')}</h3>
            <ul className="space-y-2">
              {pick(product.ingredients).map((ingredient) => (
                <li key={ingredient} className="flex items-center gap-3 text-[15px]">
                  {/* Atlas rombi — ro'yxat belgisi */}
                  <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" className="shrink-0">
                    <path d="M5 0 6 2H7L8 4H9L10 5 9 6H8L7 8H6L5 10 4 8H3L2 6H1L0 5 1 4H2L3 2H4Z" style={{ fill: 'var(--brand-ink)' }} />
                  </svg>
                  {ingredient}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Xavfni yopuvchi blok */}
        {TRUST_ITEMS.length > 0 && (
          <section className="grid gap-2.5 rounded-[18px] bg-brand-soft px-4 py-3.5">
            {TRUST_ITEMS.map(({ icon: Icon, key }) => (
              <div key={key} className="flex items-center gap-3 text-sm font-medium">
                <Icon size={18} strokeWidth={1.75} className="shrink-0 text-brand-ink" />
                {t(key, { minutes: deliveryMinutes ?? '' })}
              </div>
            ))}
          </section>
        )}

        <div className="flex items-center justify-between">
          <span className="text-[15px] font-medium text-ink-2">{t('product.quantity')}</span>
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
