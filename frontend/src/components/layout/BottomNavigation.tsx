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

/** Pastki navigatsiya: Bosh sahifa | Katalog | Savatcha | Profil */
export function BottomNavigation() {
  const pathname = usePathname();
  const { count } = useCart();
  const { t } = useI18n();
  const { haptic } = useTelegram();

  return (
    <nav aria-label="Navigation" className="fixed inset-x-0 bottom-0 z-40">
      <ul className="mx-auto grid max-w-lg grid-cols-4 border-t border-line bg-surface px-2 pt-1 pb-safe">
        {TABS.map(({ href, icon: Icon, label }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                onClick={() => haptic.select()}
                className={cn(
                  'relative flex flex-col items-center gap-1 pt-2.5 pb-1 text-[11px] font-medium transition-colors duration-200',
                  active ? 'text-brand-ink' : 'text-ink-2',
                )}
              >
                {/* Faol bo'limning "ipi" — atlas ranglaridagi ingichka chiziq */}
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute top-0 flex h-[3px] w-8 overflow-hidden rounded-full transition-opacity duration-200',
                    active ? 'opacity-100' : 'opacity-0',
                  )}
                >
                  <span className="flex-[3] bg-brand" />
                  <span className="flex-1 bg-silk-2" />
                  <span className="flex-1 bg-silk-3" />
                </span>
                <Icon size={23} strokeWidth={1.75} />
                {t(label)}
                {href === '/cart' && count > 0 && (
                  <span
                    key={count}
                    className="price absolute top-1 left-1/2 ml-1.5 flex h-[18px] min-w-[18px] animate-badge items-center justify-center rounded-full bg-silk-2 px-1 text-[10px] font-bold text-white"
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
