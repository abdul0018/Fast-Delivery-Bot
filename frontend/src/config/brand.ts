/**
 * Restoran brendi — shablonni boshqa restoranga moslashtirish uchun FAQAT shu faylni o'zgartiring.
 * Ranglar CSS o'zgaruvchilariga aylanadi va butun dizayn ulardan foydalanadi.
 *
 *  brand    — asosiy rang (sarlavha bloklari, asosiy tugmalar, faol holatlar)
 *  onBrand  — brand rang ustidagi matn rangi
 *  accent   — ikkinchi, quvnoq rang ("+" tugmalari, chegirma yorliqlari, faol menyu)
 *  onAccent — accent ustidagi matn rangi
 *
 * Eslatma: matn tushadigan qizil maydonlar brand rangining biroz to'qroq variantidan (--brand-fill) foydalanadi,
 * shuning uchun och brand rang tanlansa ham krem matn o'qiladi — onBrand bilan kontrastni baribir tekshiring.
 *
 * promises — restoran haqiqatda bajaradigan va'dalar. Bajarilmaydiganini false/null qiling —
 * ilovada (bosh sahifa, mahsulot oynasi) ko'rinmay qoladi. Hozirgi qiymatlar NAMUNA.
 */
export const brand = {
  name: 'Fast Delivery',
  colors: {
    brand: '#E8392B',
    onBrand: '#FFF3E2',
    accent: '#FFBF2E',
    onAccent: '#3A1D0F',
  },
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
  '--accent': brand.colors.accent,
  '--on-accent': brand.colors.onAccent,
} as Record<string, string>;
