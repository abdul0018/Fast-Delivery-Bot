'use client';

/**
 * Order Bump: "Bunga qo'shimcha ravishda Coca-Cola ni atigi 5 000 so'mga qo'shasizmi?" + Switch.
 * Taklif mahsuloti va narxi backend'dan (/api/config) keladi.
 */
import { Switch } from '@/components/ui/Switch';
import { useCart } from '@/hooks/useCart';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import { asset, cn, formatPrice } from '@/lib/utils';

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
    <section
      className={cn(
        'rounded-[20px] border transition-colors duration-300 ease-out-expo',
        bump ? 'border-brand bg-surface' : 'border-transparent bg-brand-soft',
      )}
    >
      <label className="flex cursor-pointer items-center gap-3 p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(product.image)} alt="" className="size-[60px] shrink-0 rounded-[14px] bg-tile object-cover" />
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] leading-snug">
            {t('cart.bumpText', { name: pick(product.name), price: formatPrice(price) })}
          </span>
          <span className="price mt-1 flex items-baseline gap-1.5">
            <span className="text-[15px] font-semibold">
              {formatPrice(price)} {t('common.currency')}
            </span>
            <span className="text-[12px] text-ink-2 line-through">{formatPrice(product.price)}</span>
          </span>
        </span>
        <Switch checked={bump} onChange={toggle} label={t('cart.bumpTitle')} />
      </label>
    </section>
  );
}
