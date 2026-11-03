/**
 * Do'kon brendi — shablonni boshqa do'konga moslashtirish uchun FAQAT shu faylni o'zgartiring.
 * Hozirgi sozlama: MoreFish (Ikra · Baliq · Go'sht delikateslari, Toshkent).
 *
 *  colors.brand     — asosiy rang (tugmalar, savatcha paneli, tanlangan kategoriya) — logotipdagi ko'k
 *  colors.onBrand   — brand ustidagi matn va ikonkalar (kontrast kamida 4.5:1)
 *  colors.brandSoft — brendning juda och varianti (taklif kartasi, belgilar foni)
 *  colors.brandInk  — brandSoft ustidagi matn uchun to'q variant
 *
 * promises — do'kon haqiqatda bajaradigan va'dalar (bosh sahifa banneri va mahsulot oynasida ko'rinadi).
 */
import type { Localized } from '@/types';

export type PromiseIcon = 'truck' | 'fish' | 'scissors' | 'snowflake';

export const brand = {
  name: 'MoreFish',
  tagline: { ru: 'Икра · Рыба · Мясные деликатесы', uz: "Ikra · Baliq · Go'sht delikateslari" } as Localized,
  /** Logotip (public/images ichida) */
  logo: '/images/logo.png',
  colors: {
    brand: '#1E56A0',
    onBrand: '#FFFFFF',
    brandSoft: '#E8F0FA',
    brandInk: '#174A8C',
  },
  /** Telegram sarlavha va fon rangi (ilova foni bilan bir xil) */
  chrome: '#F4F4F2',
  /** Telegram bot (admin panelga "Открыть в Telegram" havolasi uchun) */
  botUsername: 'morefish_uz_bot',
  contacts: {
    phone: '+998903497071',
    telegram: 'morefish_uz',
    instagram: 'morefish.uz',
  },
  /** Do'konning postlaridan olingan haqiqiy va'dalar */
  promises: [
    { icon: 'truck', text: { ru: 'Доставка по Ташкенту через Yandex', uz: "Toshkent bo'ylab Yandex orqali yetkazamiz" } },
    { icon: 'snowflake', text: { ru: 'Лосось из Норвегии — не замороженный', uz: 'Norvegiya lososi — muzlatilmagan' } },
    { icon: 'scissors', text: { ru: 'Нарежем любое количество', uz: 'Istalgan miqdorda kesib beramiz' } },
  ] as { icon: PromiseIcon; text: Localized }[],
  /** Savatchadagi yetkazib berish qatori: narx yo'q — Yandex tarifi bo'yicha alohida to'lanadi */
  delivery: { ru: 'Yandex, оплачивается отдельно', uz: "Yandex, alohida to'lanadi" } as Localized,
  /** Katalog bo'limlari (backend'dagi products.category bilan bir xil) va ularning rasmlari */
  categories: [
    { id: 'smoked', image: '/images/products/tolstolobik-hot-smoked.jpg' },
    { id: 'salmon', image: '/images/products/salmon-yukola.jpg' },
    { id: 'delicacy', image: '/images/products/chess-roll.jpg' },
    { id: 'caviar', image: '/images/products/trout-caviar.jpg' },
  ],
  /** Mahsulot oynasida "Qo'shib oling" qatori uchun kategoriya */
  addOnCategory: 'caviar',
} as const;

/** <html> ga qo'yiladigan CSS o'zgaruvchilari */
export const brandCssVars = {
  '--brand': brand.colors.brand,
  '--on-brand': brand.colors.onBrand,
  '--brand-soft': brand.colors.brandSoft,
  '--brand-ink': brand.colors.brandInk,
} as Record<string, string>;
