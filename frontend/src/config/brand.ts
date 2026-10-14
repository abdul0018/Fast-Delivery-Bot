/**
 * Restoran brendi — shablonni boshqa restoranga moslashtirish uchun FAQAT shu faylni o'zgartiring.
 * Ranglar CSS o'zgaruvchilariga aylanadi (--brand, --silk-2, --silk-3) va butun dizayn ulardan foydalanadi.
 *
 *  brand    — asosiy rang (sarlavha maydoni, asosiy tugmalar, faol holatlar)
 *  onBrand  — brand rang ustidagi matn rangi (och brand rang tanlansa, qora qiling)
 *  silk2/3  — atlas naqshining ikki yordamchi rangi
 *
 * promises — restoran haqiqatda bajaradigan va'dalar. Bajarilmaydiganini false/null qiling —
 * ilovada (bosh sahifa, mahsulot oynasi) ko'rinmay qoladi. Hozirgi qiymatlar NAMUNA.
 */
export const brand = {
  name: 'Fast Delivery',
  colors: {
    brand: '#2A2C9B',
    onBrand: '#FFFFFF',
    silk2: '#D11D6B',
    silk3: '#FFB31A',
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
  '--silk-2': brand.colors.silk2,
  '--silk-3': brand.colors.silk3,
} as Record<string, string>;
