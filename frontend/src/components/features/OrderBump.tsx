'use client';

/**
 * Order Bump: "Bunga qo'shimcha ravishda Coca-Cola ni atigi 5 000 so'mga qo'shasizmi?" + Switch.
 * Xantal kartochka; taklif mahsuloti va narxi backend'dan (/api/config) keladi.
 */
import { Switch } from '@/components/ui/Switch';
import { useCart } from '@/hooks/useCart';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import { formatPrice } from '@/lib/utils';

export function OrderBump() {
  const { bump, bumpOffer, setBump } = useCart();
  const { t, pick } = useI18n();
  const { haptic } = useTelegram();

  if (!bumpOffer) return null;
  const { product, price } = bumpOffer;

  const toggle = (value: boolean) => {
    haptic.impact(value ? 'medium' : 'light');
    setBump(value);
  };

  return (
    <section className="rounded-[26px] border-2 border-outline bg-accent text-on-accent">
      <label className="flex cursor-pointer items-center gap-3 p-3.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt="" className="size-[62px] shrink-0 rounded-full border-2 border-outline bg-surface object-cover" />
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] leading-snug font-extrabold">
            {t('cart.bumpText', { name: pick(product.name), price: formatPrice(price) })}
          </span>
          <span className="price mt-1 block text-[13px] font-bold">
            <span className="line-through opacity-70">{formatPrice(product.price)}</span>{' '}
            <span className="font-black">
              {formatPrice(price)} {t('common.currency')}
            </span>
          </span>
        </span>
        <Switch checked={bump} onChange={toggle} label={t('cart.bumpTitle')} />
      </label>
    </section>
  );
}
