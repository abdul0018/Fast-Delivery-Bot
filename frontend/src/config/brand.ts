/**
 * Restoran brendi — shablonni boshqa restoranga moslashtirish uchun FAQAT shu faylni o'zgartiring.
 * Ranglar CSS o'zgaruvchilariga aylanadi va butun dizayn ulardan foydalanadi.
 *
 *  brand    — asosiy qizil (splash/onboarding fon, asosiy tugmalar, faol ikonkalar, narx)
 *  onBrand  — brand ustidagi matn (oq)
 *  accent   — "+" qo'shish tugmalari (yashil)
 *  onAccent — accent ustidagi ikonka/matn
 *  soft     — yumshoq fon (pushti: mahsulot rasmi foni, belgi va chiplar)
 *
 * Eslatma: matn tushadigan qizil maydonlar brand rangining biroz to'qroq variantidan (--brand-fill)
 * foydalanadi — oq matn kontrasti 4.5:1 dan past tushmasligi uchun.
 *
 * promises — restoran haqiqatda bajaradigan va'dalar. Bajarilmaydiganini false/null qiling —
 * ilovada (bosh sahifa, mahsulot oynasi) ko'rinmay qoladi. Hozirgi qiymatlar NAMUNA.
 */
export const brand = {
  name: 'Fast Delivery',
  colors: {
    brand: '#F00000',
    onBrand: '#FFFFFF',
    accent: '#006D1A',
    onAccent: '#FFFFFF',
    soft: '#FCDED4',
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
  '--soft': brand.colors.soft,
} as Record<string, string>;
