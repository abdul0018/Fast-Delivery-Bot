'use client';

/**
 * Order Bump: "Bunga qo'shimcha ravishda Coca-Cola ni atigi 5 000 so'mga qo'shasizmi?" + Switch.
 * Taklif mahsuloti va narxi backend'dan (/api/config) keladi.
 */
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
        'relative flex items-center gap-3 overflow-hidden rounded-3xl border-2 border-dashed p-3 transition-colors',
        bump ? 'border-success bg-success/10' : 'border-brand/50 bg-brand-soft',
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={product.image} alt="" className="size-16 shrink-0 rounded-2xl bg-surface object-cover" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold tracking-wide text-brand uppercase">⚡ {t('cart.bumpTitle')}</p>
        <p className="mt-0.5 text-sm leading-snug font-medium">
          {t('cart.bumpText', { name: pick(product.name), price: formatPrice(price) })}
        </p>
        <p className="mt-1 text-xs">
          <span className="text-hint line-through">{formatPrice(product.price)}</span>{' '}
          <span className="font-bold text-sale">
            {formatPrice(price)} {t('common.currency')}
          </span>
        </p>
      </div>
      <Switch checked={bump} onChange={toggle} label={t('cart.bumpTitle')} />
    </section>
  );
}
