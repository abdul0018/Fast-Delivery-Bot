/**
 * Ilova sozlamalari: til, onboarding ko'rilganmi, ko'rilgan story'lar.
 */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { DEFAULT_LANG } from '@/lib/i18n';
import type { Lang } from '@/types';

interface SettingsState {
  lang: Lang;
  /** Foydalanuvchi tilni o'zi tanlaganmi (aks holda Telegram/bot tili ishlatiladi) */
  langChosen: boolean;
  onboarded: boolean;
  seenStories: string[];
  setLang: (lang: Lang, chosen?: boolean) => void;
  completeOnboarding: () => void;
  markStorySeen: (id: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      lang: DEFAULT_LANG,
      langChosen: false,
      onboarded: false,
      seenStories: [],
      setLang: (lang, chosen = true) => set((state) => ({ lang, langChosen: state.langChosen || chosen })),
      completeOnboarding: () => set({ onboarded: true }),
      markStorySeen: (id) =>
        set((state) => (state.seenStories.includes(id) ? state : { seenStories: [...state.seenStories, id] })),
    }),
    { name: 'fd-settings', version: 1, storage: createJSONStorage(() => localStorage) },
  ),
);
