'use client';

/**
 * Suzuvchi savatcha paneli (Yandex Eda / Uzum uslubida): savatcha bo'sh bo'lmasa, pastki menyu ustida
 * doim mahsulotlar soni va jami summani ko'rsatadi. Bosilsa — savatchaga o'tadi.
 */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';

export function CartBar() {
  const pathname = usePathname();
  const { count, total, isEmpty } = useCart();
  const { t, price } = useI18n();
  const { haptic } = useTelegram();

  if (isEmpty || pathname.startsWith('/cart')) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-30 mx-auto max-w-lg px-3"
      style={{ bottom: 'calc(62px + max(env(safe-area-inset-bottom), 0.5rem))' }}
    >
      <Link
        href="/cart"
        onClick={() => haptic.impact('light')}
        className="pointer-events-auto flex h-14 animate-bar-in items-center gap-3 rounded-[18px] bg-brand pr-4 pl-2 text-on-brand shadow-(--shadow-float) transition-transform duration-200 ease-out-expo active:scale-[0.985]"
      >
        <span className="relative flex size-10 items-center justify-center rounded-[13px] bg-white/45">
          <ShoppingBag size={20} strokeWidth={2} />
          <span
            key={count}
            className="price absolute -top-1 -right-1 flex h-[18px] min-w-[18px] animate-pop-in items-center justify-center rounded-full bg-ink px-1 text-[11px] font-semibold text-white"
          >
            {count}
          </span>
        </span>
        <span className="flex-1 text-[15px] font-semibold">{t('cart.openCart')}</span>
        <span key={total} className="price animate-fade-in text-[16px] font-semibold">
          {price(total)}
        </span>
      </Link>
    </div>
  );
}
