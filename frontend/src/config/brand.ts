/**
 * Restoran brendi — shablonni boshqa restoranga moslashtirish uchun FAQAT shu faylni o'zgartiring.
 * Ranglar CSS o'zgaruvchilariga aylanadi va butun dizayn ulardan foydalanadi.
 *
 *  brand     — asosiy rang (asosiy tugmalar, savatcha paneli, "+" tugmasi, tanlangan kategoriya)
 *  onBrand   — brand ustidagi matn va ikonkalar (kontrast kamida 4.5:1 bo'lsin)
 *  brandSoft — brendning juda och varianti (qo'shimcha taklif kartasi, belgilar foni)
 *  brandInk  — brandSoft ustidagi matn uchun to'q variant (kontrast kamida 4.5:1)
 *
 * promises — restoran haqiqatda bajaradigan va'dalar. Bajarilmaydiganini false/null qiling —
 * ilovada (bosh sahifa, mahsulot oynasi) ko'rinmay qoladi. Hozirgi qiymatlar NAMUNA.
 */
export const brand = {
  name: 'Fast Delivery',
  colors: {
    brand: '#FFC21A',
    onBrand: '#1C1A14',
    brandSoft: '#FFF4D6',
    brandInk: '#8A5A00',
  },
  /** Telegram sarlavha va fon rangi (ilova foni bilan bir xil) */
  chrome: '#F4F4F2',
  promises: {
    /** O'rtacha yetkazib berish vaqti, daqiqa (null — ko'rsatilmaydi) */
    deliveryMinutes: 30 as number | null,
    halal: true,
    freeDelivery: true,
    freshDaily: true,
  },
} as const;

/** <html> ga qo'yiladigan CSS o'zgaruvchilari */
export const brandCssVars = {
  '--brand': brand.colors.brand,
  '--on-brand': brand.colors.onBrand,
  '--brand-soft': brand.colors.brandSoft,
  '--brand-ink': brand.colors.brandInk,
} as Record<string, string>;
