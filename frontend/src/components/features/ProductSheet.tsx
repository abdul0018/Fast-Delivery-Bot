'use client';

/**
 * Mahsulot tafsilotlari — alohida sahifa emas, pastdan chiquvchi Bottom Sheet.
 * Katta surat, nom va narx, tarkibi (bullet), ichimlik qo'shish qatori, xavfni yopuvchi blok
 * va pastga yopishgan "soni + Savatchaga qo'shish — narx" paneli.
 */
import { useEffect, useState } from 'react';
import { Leaf, Plus, ShieldCheck, Timer, X } from 'lucide-react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { brand } from '@/config/brand';
import { useCart } from '@/hooks/useCart';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import { asset, discountPercent, formatPrice } from '@/lib/utils';
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
      {product && (
        <ProductDetails product={product} quantity={quantity} onQuantityChange={setQuantity} onClose={closeProduct} />
      )}
    </BottomSheet>
  );
}

function ProductDetails({
  product,
  quantity,
  onQuantityChange,
  onClose,
}: {
  product: Product;
  quantity: number;
  onQuantityChange: (value: number) => void;
  onClose: () => void;
}) {
  const { t, pick, price } = useI18n();
  const { haptic } = useTelegram();
  const { add } = useCart();
  const showToast = useUiStore((state) => state.showToast);
  const products = useCatalogStore((state) => state.products);
  const discount = discountPercent(product.price, product.oldPrice);
  const ingredients = pick(product.ingredients);
  // Ichimlik qo'shish qatori (ichimlikning o'zida ko'rsatilmaydi)
  const addOns = product.category === 'drinks' ? [] : products.filter((item) => item.category === 'drinks').slice(0, 3);

  return (
    <div className="pb-6">
      <div className="relative aspect-[4/3] w-full bg-tile">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(product.image)} alt={pick(product.name)} className="size-full object-cover" />
        <button
          type="button"
          onClick={onClose}
          aria-label={t('common.close')}
          className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-white/95 text-ink shadow-(--shadow-thumb)"
        >
          <X size={19} strokeWidth={2.25} />
        </button>
      </div>

      <div className="space-y-6 px-5 pt-5">
        <div>
          <h2 className="text-[24px] leading-tight font-semibold">{pick(product.name)}</h2>
          <div className="mt-2.5 flex items-center justify-between gap-3">
            <p className="price flex min-w-0 flex-wrap items-baseline gap-x-2">
              <span className={discount > 0 ? 'text-[22px] font-semibold text-sale' : 'text-[22px] font-semibold'}>
                {price(product.price)}
              </span>
              {product.oldPrice && <span className="text-[15px] text-ink-2 line-through">{formatPrice(product.oldPrice)}</span>}
            </p>
            <QuantityStepper
              label={t('product.quantity')}
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
          <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{pick(product.description)}</p>
        </div>

        {ingredients.length > 0 && (
          <section>
            <h3 className="mb-2 text-[17px] font-semibold">{t('product.ingredients')}</h3>
            <ul className="divide-y divide-line rounded-[16px] bg-tile/60 px-4">
              {ingredients.map((ingredient) => (
                <li key={ingredient} className="flex items-center gap-3 py-2.5 text-[15px]">
                  <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-ink-2" />
                  {ingredient}
                </li>
              ))}
            </ul>
          </section>
        )}

        {addOns.length > 0 && (
          <section>
            <h3 className="mb-2 text-[17px] font-semibold">{t('product.addOneHint')}</h3>
            <div className="grid grid-cols-3 gap-2">
              {addOns.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`+ ${pick(item.name)}`}
                  onClick={() => {
                    haptic.impact('medium');
                    add(item);
                    showToast(t('product.added'));
                  }}
                  className="group flex flex-col rounded-[16px] bg-tile/60 p-1.5 pb-2.5 text-left transition-transform duration-200 ease-out-expo active:scale-[0.97]"
                >
                  <span className="relative block aspect-square overflow-hidden rounded-[12px] bg-tile">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={asset(item.image)} alt="" className="size-full object-cover" />
                    <span className="absolute right-1.5 bottom-1.5 flex size-7 items-center justify-center rounded-full bg-surface text-ink shadow-(--shadow-thumb)">
                      <Plus size={16} strokeWidth={2.25} />
                    </span>
                  </span>
                  <span className="mt-2 line-clamp-1 px-1 text-[12px] text-ink">{pick(item.name)}</span>
                  <span className="price px-1 text-[13px] font-semibold">{price(item.price)}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {TRUST_ITEMS.length > 0 && (
          <section className="grid gap-3 rounded-[16px] border border-line px-4 py-3.5">
            {TRUST_ITEMS.map(({ icon: Icon, key }) => (
              <div key={key} className="flex items-center gap-3 text-[14px]">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-tile text-ink">
                  <Icon size={17} strokeWidth={2} />
                </span>
                {t(key, { minutes: deliveryMinutes ?? '' })}
              </div>
            ))}
          </section>
        )}
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
