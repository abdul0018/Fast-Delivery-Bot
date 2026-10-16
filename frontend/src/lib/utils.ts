import { clsx, type ClassValue } from 'clsx';
import type { Lang, Localized } from '@/types';

/**
 * Sayt ichidagi fayl yo'liga basePath qo'shish (GitHub Pages: /Fast-Delivery-Bot/...).
 * next/link avtomatik qo'shadi, lekin oddiy <img src> qo'shmaydi.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const asset = (path: string) => (path.startsWith('/') && !path.startsWith('//') ? `${BASE_PATH}${path}` : path);

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

// Brauzerlarda o'zbekcha sana ma'lumotlari to'liq emas, shuning uchun oy nomlari qo'lda
const MONTHS: Record<Lang, string[]> = {
  uz: ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'],
  ru: ['янв.', 'февр.', 'марта', 'апр.', 'мая', 'июня', 'июля', 'авг.', 'сент.', 'окт.', 'нояб.', 'дек.'],
};

/** "16-oktabr, 02:46" | "16 окт., 02:46" */
export const formatDate = (iso: string, lang: Lang) => {
  const date = new Date(iso);
  const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  const month = MONTHS[lang][date.getMonth()];
  return lang === 'ru' ? `${date.getDate()} ${month}, ${time}` : `${date.getDate()}-${month}, ${time}`;
};
