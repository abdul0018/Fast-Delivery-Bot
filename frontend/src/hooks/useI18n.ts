'use client';

import { useCallback } from 'react';
import { translate, type TranslateParams, type TranslationKey } from '@/lib/i18n';
import { formatPrice, pick as pickLocalized } from '@/lib/utils';
import { useSettingsStore } from '@/store/settingsStore';
import type { Localized } from '@/types';

/**
 * Joriy til va tarjima funksiyalari.
 *   const { t, pick, price } = useI18n();
 *   t('cart.title')            -> "Savatcha" | "Корзина"
 *   pick(product.name)         -> mahsulot nomi joriy tilda
 *   price(32000)               -> "32 000 so'm" | "32 000 сум"
 */
export function useI18n() {
  const lang = useSettingsStore((state) => state.lang);
  const setLang = useSettingsStore((state) => state.setLang);

  const t = useCallback(
    (key: TranslationKey, params?: TranslateParams) => translate(lang, key, params),
    [lang],
  );
  const pick = useCallback(<T,>(value: Localized<T>) => pickLocalized(value, lang), [lang]);
  const price = useCallback(
    (amount: number) => `${formatPrice(amount)} ${translate(lang, 'common.currency')}`,
    [lang],
  );

  return { lang, setLang, t, pick, price };
}
