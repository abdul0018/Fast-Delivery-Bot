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
import { Logo } from './Header';

function Splash() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-brand text-on-brand">
      <Logo size="lg" className="animate-pulse" />
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
