/**
 * Joriy foydalanuvchi (backend /api/me): telefon, manzil, tanlangan til.
 */
import { create } from 'zustand';
import { api, canAuthenticate } from '@/lib/api';
import type { AppUser, Lang } from '@/types';

interface UserState {
  me: AppUser | null;
  loaded: boolean;
  loadMe: () => Promise<AppUser | null>;
  updateMe: (data: Partial<{ language: Lang; phone: string; address: string }>) => Promise<void>;
}

export const useUserStore = create<UserState>()((set) => ({
  me: null,
  loaded: false,

  loadMe: async () => {
    if (!canAuthenticate()) {
      set({ loaded: true });
      return null;
    }
    try {
      const me = await api.getMe();
      set({ me, loaded: true });
      return me;
    } catch {
      set({ loaded: true });
      return null;
    }
  },

  updateMe: async (data) => {
    if (!canAuthenticate()) return;
    try {
      const me = await api.updateMe(data);
      set({ me });
    } catch {
      /* tarmoq xatosi — lokal holat saqlanib qoladi */
    }
  },
}));
