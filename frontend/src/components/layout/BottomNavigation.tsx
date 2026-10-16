'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { House, Search, ShoppingCart, UserRound, type LucideIcon } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import type { TranslationKey } from '@/lib/i18n';
import { cn } from '@/lib/utils';

// Namunadagidek: uy, savat, qidiruv, foydalanuvchi — oddiy chiziqli ikonkalar
const TABS: { href: string; icon: LucideIcon; label: TranslationKey }[] = [
  { href: '/', icon: House, label: 'nav.home' },
  { href: '/catalog', icon: Search, label: 'nav.catalog' },
  { href: '/cart', icon: ShoppingCart, label: 'nav.cart' },
  { href: '/profile', icon: UserRound, label: 'nav.profile' },
];

/** Pastki navigatsiya: oq panel, faol bo'lim qizil ikonka va nuqta */
export function BottomNavigation() {
  const pathname = usePathname();
  const { count } = useCart();
  const { t } = useI18n();
  const { haptic } = useTelegram();

  return (
    <nav aria-label="Navigation" className="fixed inset-x-0 bottom-0 z-40">
      <ul className="mx-auto grid max-w-lg grid-cols-4 border-t border-line bg-ground px-2 pt-2.5 pb-safe">
        {TABS.map(({ href, icon: Icon, label }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-label={t(label)}
                aria-current={active ? 'page' : undefined}
                onClick={() => haptic.select()}
                className={cn(
                  'relative flex flex-col items-center gap-1.5 pb-1 text-[11px] font-semibold transition-colors duration-200',
                  active ? 'text-brand-ink' : 'text-ink-2',
                )}
              >
                <Icon size={24} strokeWidth={active ? 2.25 : 1.9} className={active ? 'fill-brand/10' : undefined} />
                <span className={cn('size-1.5 rounded-full', active ? 'bg-brand' : 'bg-transparent')} />
                {href === '/cart' && count > 0 && (
                  <span
                    key={count}
                    className="price absolute -top-1.5 left-1/2 ml-1.5 flex h-[18px] min-w-[18px] animate-pop-in items-center justify-center rounded-full bg-brand-fill px-1 text-[10px] font-bold text-on-brand"
                  >
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
