'use client';

/**
 * Telegram WebApp konteksti.
 *  - WebApp.ready() / expand() ni chaqiradi, mavzu (light/dark) ni kuzatadi
 *  - Tilni aniqlaydi: backend (bot) tanlovi -> ?lang= parametri -> Telegram language_code
 *  - Haptic feedback uchun qulay funksiyalar beradi
 */
import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { brand } from '@/config/brand';
import { detectLang, isLang } from '@/lib/i18n';
import { useSettingsStore } from '@/store/settingsStore';
import { useUserStore } from '@/store/userStore';

interface TelegramContextValue {
  webApp: TelegramWebApp | null;
  user: TelegramWebAppUser | null;
  /** Ilova haqiqatan Telegram ichida ochilganmi (initData bor) */
  isTelegram: boolean;
  ready: boolean;
  haptic: {
    impact: (style?: HapticImpact) => void;
    notify: (type: HapticNotification) => void;
    select: () => void;
  };
}

export const TelegramContext = createContext<TelegramContextValue | null>(null);

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const tg = window.Telegram?.WebApp ?? null;
    const applyTheme = () => document.documentElement.classList.toggle('dark', tg?.colorScheme === 'dark');
    const settings = useSettingsStore.getState();

    // 1) Dastlabki til: ?lang= (botdan) yoki Telegram tili — foydalanuvchi o'zi tanlamagan bo'lsa
    if (!settings.langChosen) {
      const fromUrl = new URLSearchParams(window.location.search).get('lang');
      settings.setLang(isLang(fromUrl) ? fromUrl : detectLang(tg?.initDataUnsafe.user?.language_code), false);
    }

    if (tg) {
      tg.ready();
      tg.expand();
      // Bottom Sheet'ni pastga tortganda ilova yopilib qolmasligi uchun (Bot API 7.7+)
      if (tg.isVersionAtLeast('7.7')) tg.disableVerticalSwipes?.();
      // Telegram sarlavhasi brend rangida — atlas maydoni ilova tepasidan boshlanadi
      if (tg.isVersionAtLeast('6.9')) {
        tg.setHeaderColor(brand.colors.brand);
        tg.setBackgroundColor(tg.colorScheme === 'dark' ? '#13111c' : '#f7f3ec');
      }

      applyTheme();
      tg.onEvent('themeChanged', applyTheme);
      setWebApp(tg);
    }
    setReady(true);

    // 2) Backend'dagi til (botda tanlangan) ustun turadi
    useUserStore
      .getState()
      .loadMe()
      .then((me) => {
        if (me?.language) useSettingsStore.getState().setLang(me.language, false);
      });

    return () => tg?.offEvent('themeChanged', applyTheme);
  }, []);

  const impact = useCallback((style: HapticImpact = 'light') => webApp?.HapticFeedback?.impactOccurred(style), [webApp]);
  const notify = useCallback((type: HapticNotification) => webApp?.HapticFeedback?.notificationOccurred(type), [webApp]);
  const select = useCallback(() => webApp?.HapticFeedback?.selectionChanged(), [webApp]);

  const value = useMemo<TelegramContextValue>(
    () => ({
      webApp,
      user: webApp?.initDataUnsafe.user ?? null,
      isTelegram: Boolean(webApp?.initData),
      ready,
      haptic: { impact, notify, select },
    }),
    [webApp, ready, impact, notify, select],
  );

  return <TelegramContext.Provider value={value}>{children}</TelegramContext.Provider>;
}
