'use client';

/**
 * Ilova qobig'i:
 *  - localStorage holati tiklanguncha splash ko'rsatadi (hydration xatolarining oldini oladi)
 *  - birinchi kirishda Onboarding
 *  - Telegram "Orqaga" tugmasi, pastki navigatsiya, mahsulot Bottom Sheet'i va toast
 */
import { useEffect, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Onboarding } from '@/components/features/Onboarding';
import { ProductSheet } from '@/components/features/ProductSheet';
import { Toast } from '@/components/ui/Toast';
import { useBackButton, useTelegram } from '@/hooks/useTelegram';
import { useI18n } from '@/hooks/useI18n';
import { useSettingsStore } from '@/store/settingsStore';
import { useUiStore } from '@/store/uiStore';
import { BottomNavigation } from './BottomNavigation';

function Splash() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3">
      <div className="animate-pop text-6xl">🍔</div>
      <div className="h-1 w-24 overflow-hidden rounded-full bg-muted">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-brand" />
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const { ready } = useTelegram();
  const { lang } = useI18n();
  const onboarded = useSettingsStore((state) => state.onboarded);
  const activeProduct = useUiStore((state) => state.activeProduct);
  const closeProduct = useUiStore((state) => state.closeProduct);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => setHydrated(true), []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Telegram "Orqaga" tugmasi: avval ochiq panelni yopadi, keyin oldingi sahifaga qaytadi
  useBackButton(Boolean(activeProduct) || pathname !== '/', () => {
    if (useUiStore.getState().activeProduct) closeProduct();
    else router.back();
  });

  if (!hydrated || !ready) return <Splash />;
  if (!onboarded) return <Onboarding />;

  return (
    <>
      <main className="mx-auto min-h-dvh max-w-lg pb-28">{children}</main>
      <BottomNavigation />
      <ProductSheet />
      <Toast />
    </>
  );
}
