import { clsx, type ClassValue } from 'clsx';
import type { Lang, Localized } from '@/types';

/** Tailwind klasslarini shartli birlashtirish */
export const cn = (...inputs: ClassValue[]) => clsx(inputs);

/** 32000 -> "32 000" */
export const formatPrice = (amount: number) =>
  String(Math.round(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

/** Chegirma foizi: 38000 -> 32000 = 16 */
export const discountPercent = (price: number, oldPrice: number | null) =>
  oldPrice && oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

/** { uz, ru } dan joriy tildagi qiymatni olish */
export const pick = <T>(value: Localized<T>, lang: Lang): T => value[lang] ?? value.uz;

export const formatDate = (iso: string, lang: Lang) =>
  new Date(iso).toLocaleString(lang === 'ru' ? 'ru-RU' : 'uz-UZ', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
