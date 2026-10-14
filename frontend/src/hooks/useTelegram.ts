'use client';

import { useContext, useEffect, useRef } from 'react';
import { TelegramContext } from '@/providers/TelegramProvider';

/** Telegram WebApp konteksti: webApp, user, haptic ... */
export function useTelegram() {
  const context = useContext(TelegramContext);
  if (!context) throw new Error('useTelegram TelegramProvider ichida ishlatilishi kerak');
  return context;
}

/** Telegram'ning tepadagi "Orqaga" tugmasini boshqarish */
export function useBackButton(visible: boolean, onClick: () => void) {
  const { webApp } = useTelegram();
  const handlerRef = useRef(onClick);
  handlerRef.current = onClick;

  useEffect(() => {
    const backButton = webApp?.BackButton;
    if (!backButton || !webApp.isVersionAtLeast('6.1')) return;

    const handler = () => handlerRef.current();
    if (visible) {
      backButton.show();
      backButton.onClick(handler);
    } else {
      backButton.hide();
    }
    return () => backButton.offClick(handler);
  }, [webApp, visible]);
}
