'use client';

/**
 * Order Bump: "Bunga qo'shimcha ravishda Coca-Cola ni atigi 5 000 so'mga qo'shasizmi?" + Switch.
 * Taklif mahsuloti va narxi backend'dan (/api/config) keladi.
 */
import { AtlasBand } from '@/components/ui/AtlasBand';
import { Switch } from '@/components/ui/Switch';
import { useCart } from '@/hooks/useCart';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import { cn, formatPrice } from '@/lib/utils';

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
        'overflow-hidden rounded-[20px] transition-colors duration-300',
        bump ? 'bg-brand text-on-brand' : 'bg-surface',
      )}
    >
      <AtlasBand variant="rail" height={12} tile={48} seed={9} />
      <label className="flex cursor-pointer items-center gap-3 p-3.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt="" className="size-[60px] shrink-0 rounded-[14px] bg-muted object-cover" />
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] leading-snug font-semibold">
            {t('cart.bumpText', { name: pick(product.name), price: formatPrice(price) })}
          </span>
          <span className="price mt-1 block text-[13px]">
            <span className={cn('line-through', bump ? 'text-on-brand/70' : 'text-ink-2')}>{formatPrice(product.price)}</span>{' '}
            <span className={cn('font-bold', bump ? 'text-silk-3' : 'text-sale')}>
              {formatPrice(price)} {t('common.currency')}
            </span>
          </span>
        </span>
        <Switch checked={bump} onChange={toggle} label={t('cart.bumpTitle')} />
      </label>
    </section>
  );
}
