'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { House, LayoutGrid, ShoppingBag, UserRound, type LucideIcon } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import type { TranslationKey } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const TABS: { href: string; icon: LucideIcon; label: TranslationKey }[] = [
  { href: '/', icon: House, label: 'nav.home' },
  { href: '/catalog', icon: LayoutGrid, label: 'nav.catalog' },
  { href: '/cart', icon: ShoppingBag, label: 'nav.cart' },
  { href: '/profile', icon: UserRound, label: 'nav.profile' },
];

/** Pastki navigatsiya: Bosh sahifa | Katalog | Savatcha | Profil — jigarrang panel, faol bo'lim xantal */
export function BottomNavigation() {
  const pathname = usePathname();
  const { count } = useCart();
  const { t } = useI18n();
  const { haptic } = useTelegram();

  return (
    <nav aria-label="Navigation" className="fixed inset-x-0 bottom-0 z-40">
      <ul className="mx-auto grid max-w-lg grid-cols-4 rounded-t-[28px] bg-bar px-2 pt-2 pb-safe dark:shadow-[inset_0_2px_0_var(--outline)]">
        {TABS.map(({ href, icon: Icon, label }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                onClick={() => haptic.select()}
                className={cn(
                  'relative flex flex-col items-center gap-1 pt-1.5 pb-1 text-[11px] font-bold transition-colors duration-200',
                  active ? 'text-accent' : 'text-bar-ink',
                )}
              >
                <Icon size={24} strokeWidth={2.25} />
                {t(label)}
                {href === '/cart' && count > 0 && (
                  <span
                    key={count}
                    className="price absolute top-0 left-1/2 ml-1.5 flex h-5 min-w-5 animate-stamp items-center justify-center rounded-full border-2 border-bar bg-brand-fill px-1 text-[11px] font-black text-on-brand"
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
