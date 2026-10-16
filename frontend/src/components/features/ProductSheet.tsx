'use client';

/**
 * Mahsulot tafsilotlari — alohida sahifa emas, pastdan chiquvchi Bottom Sheet.
 * Katta rasm (pushti fonda), nom va narx, tarkibi (bullet), "Qo'shimcha" ichimliklar qatori,
 * xavfni yopuvchi blok va pastga yopishgan "Savatchaga qo'shish — narx" tugmasi.
 */
import { useEffect, useState } from 'react';
import { Leaf, Plus, ShieldCheck, Timer } from 'lucide-react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { brand } from '@/config/brand';
import { useCart } from '@/hooks/useCart';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import { discountPercent, formatPrice } from '@/lib/utils';
import { useCatalogStore } from '@/store/catalogStore';
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
  const { t, pick, price } = useI18n();
  const { haptic } = useTelegram();
  const { add } = useCart();
  const showToast = useUiStore((state) => state.showToast);
  const products = useCatalogStore((state) => state.products);
  const discount = discountPercent(product.price, product.oldPrice);
  // "Qo'shimcha" — ichimliklar (namunadagi "Add One" qatori)
  const addOns = product.category === 'drinks' ? [] : products.filter((item) => item.category === 'drinks').slice(0, 3);

  return (
    <div className="pb-6">
      <div className="relative flex aspect-[5/4] w-full items-center justify-center bg-soft">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={pick(product.name)} className="size-[78%] rounded-full object-cover shadow-[0_18px_40px_-18px_rgba(0,0,0,0.45)]" />
        {discount > 0 && (
          <span className="price absolute bottom-4 left-4 rounded-full bg-brand-fill px-3 py-1 text-sm font-bold text-on-brand">
            −{discount}%
          </span>
        )}
      </div>

      <div className="space-y-6 px-5 pt-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-[24px] leading-tight font-extrabold">{pick(product.name)}</h2>
            <p className="mt-1.5 text-[15px] font-medium text-ink-2">{pick(product.description)}</p>
          </div>
          <div className="shrink-0 text-right">
            {product.oldPrice && <p className="price text-sm font-medium text-ink-2 line-through">{formatPrice(product.oldPrice)}</p>}
            <p className="price text-[22px] leading-tight font-extrabold whitespace-nowrap text-sale">{formatPrice(product.price)}</p>
            <p className="text-xs font-semibold text-ink-2">{t('common.currency')}</p>
          </div>
        </div>

        {pick(product.ingredients).length > 0 && (
          <section>
            <h3 className="mb-2.5 text-[16px] font-bold">{t('product.ingredients')}</h3>
            <ul className="space-y-2">
              {pick(product.ingredients).map((ingredient) => (
                <li key={ingredient} className="flex items-center gap-3 text-[15px] font-medium">
                  <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-brand" />
                  {ingredient}
                </li>
              ))}
            </ul>
          </section>
        )}

        {addOns.length > 0 && (
          <section>
            <h3 className="mb-2.5 text-[16px] font-bold">{t('product.addOne')}</h3>
            <div className="grid grid-cols-3 gap-2.5">
              {addOns.map((item) => (
                <div key={item.id} className="relative flex flex-col items-center rounded-[16px] bg-surface p-2 pb-2.5 text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt="" className="size-16 rounded-full object-cover" />
                  <span className="mt-1.5 line-clamp-1 text-[12px] font-bold">{pick(item.name)}</span>
                  <span className="price text-[12px] font-bold text-sale">{price(item.price)}</span>
                  <button
                    type="button"
                    aria-label={`+ ${pick(item.name)}`}
                    onClick={() => {
                      haptic.impact('medium');
                      add(item);
                      showToast(t('product.added'));
                    }}
                    className="absolute top-1.5 right-1.5 flex size-7 items-center justify-center rounded-full bg-accent text-on-accent active:scale-90"
                  >
                    <Plus size={16} strokeWidth={2.75} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {TRUST_ITEMS.length > 0 && (
          <section className="grid gap-2.5 rounded-[18px] bg-surface px-4 py-3.5">
            {TRUST_ITEMS.map(({ icon: Icon, key }) => (
              <div key={key} className="flex items-center gap-3 text-sm font-semibold">
                <Icon size={18} strokeWidth={2} className="shrink-0 text-ok" />
                {t(key, { minutes: deliveryMinutes ?? '' })}
              </div>
            ))}
          </section>
        )}

        <div className="flex items-center justify-between">
          <span className="text-[15px] font-semibold text-ink-2">{t('product.quantity')}</span>
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
