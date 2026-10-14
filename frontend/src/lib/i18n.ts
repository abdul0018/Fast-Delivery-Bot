/**
 * Lokalizatsiya (O'zbek / Rus) — matnlar src/locales/*.json da.
 *   translate('ru', 'cart.confirm', { price: '25 000 сум' })
 */
import uz from '@/locales/uz.json';
import ru from '@/locales/ru.json';
import type { Lang } from '@/types';

export const dictionaries = { uz, ru } as const;
export const SUPPORTED_LANGS: Lang[] = ['uz', 'ru'];
export const DEFAULT_LANG: Lang = 'uz';

/** "cart.methods.cash" kabi barcha kalitlar uchun tip */
type Paths<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends Record<string, unknown> ? Paths<T[K], `${P}${K}.`> : `${P}${K}`;
}[keyof T & string];

export type TranslationKey = Paths<typeof uz>;
export type TranslateParams = Record<string, string | number>;

const resolve = (dict: unknown, key: string): unknown =>
  key.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown> | undefined)?.[part], dict);

export function translate(lang: Lang, key: TranslationKey | string, params?: TranslateParams): string {
  const value = resolve(dictionaries[lang], key) ?? resolve(dictionaries[DEFAULT_LANG], key);
  if (typeof value !== 'string') return key;
  if (!params) return value;
  return value.replace(/\{(\w+)\}/g, (match, name: string) => (name in params ? String(params[name]) : match));
}

export const isLang = (value: unknown): value is Lang => SUPPORTED_LANGS.includes(value as Lang);

/** Telegram language_code -> ilova tili */
export const detectLang = (code?: string | null): Lang => (code?.startsWith('ru') ? 'ru' : DEFAULT_LANG);
