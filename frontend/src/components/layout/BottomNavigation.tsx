'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useI18n } from '@/hooks/useI18n';
import { useTelegram } from '@/hooks/useTelegram';
import type { TranslationKey } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const TABS: { href: string; icon: string; label: TranslationKey }[] = [
  { href: '/', icon: '🏠', label: 'nav.home' },
  { href: '/catalog', icon: '🔍', label: 'nav.catalog' },
  { href: '/cart', icon: '🛒', label: 'nav.cart' },
  { href: '/profile', icon: '👤', label: 'nav.profile' },
];

/** Pastki navigatsiya: Bosh sahifa | Katalog | Savatcha | Profil */
export function BottomNavigation() {
  const pathname = usePathname();
  const { count } = useCart();
  const { t } = useI18n();
  const { haptic } = useTelegram();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/90 backdrop-blur-xl">
      <ul className="mx-auto grid max-w-lg grid-cols-4 px-2 pt-1.5 pb-safe">
        {TABS.map((tab) => {
          const active = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                onClick={() => haptic.select()}
                className={cn(
                  'relative flex flex-col items-center gap-0.5 rounded-2xl py-1.5 text-[11px] font-medium transition-colors',
                  active ? 'text-brand' : 'text-hint',
                )}
              >
                <span className={cn('text-[22px] leading-none transition-transform', active && 'scale-110')}>{tab.icon}</span>
                {t(tab.label)}
                {tab.href === '/cart' && count > 0 && (
                  <span
                    key={count}
                    className="absolute top-0 left-1/2 ml-2 flex h-[18px] min-w-[18px] animate-pop items-center justify-center rounded-full bg-sale px-1 text-[10px] font-bold text-white"
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
