/**
 * Markaziy sozlamalar / Центральная конфигурация.
 * Barcha qiymatlar .env faylidan o'qiladi, kod ichida maxfiy ma'lumot saqlanmaydi.
 */
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const toInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const env = process.env.NODE_ENV || 'development';

const config = {
  env,
  isProduction: env === 'production',

  bot: {
    token: process.env.BOT_TOKEN,
    // Buyurtmalar tushadigan admin yoki guruh chat ID (guruh uchun "-100..." ko'rinishida)
    adminChatId: process.env.ADMIN_CHAT_ID || null,
    // Admin xabarlari tili: uz | ru
    adminLanguage: process.env.ADMIN_LANGUAGE === 'ru' ? 'ru' : 'uz',
    // Mini App manzili (Telegram faqat HTTPS qabul qiladi)
    webAppUrl: process.env.WEBAPP_URL || 'https://example.com',
    supportPhone: process.env.SUPPORT_PHONE || '+998 90 000 00 00',
  },

  db: {
    url: process.env.DATABASE_URL,
    logging: process.env.DB_LOGGING === 'true',
  },

  server: {
    port: toInt(process.env.PORT, 4000),
    // Vergul bilan ajratilgan ruxsat etilgan originlar (Mini App domeni)
    corsOrigins: (process.env.CORS_ORIGINS || process.env.WEBAPP_URL || '*')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  },

  auth: {
    // initData necha soniya amal qiladi (default: 24 soat)
    initDataMaxAge: toInt(process.env.INIT_DATA_MAX_AGE, 86400),
    // Faqat lokal ishlab chiqish uchun: Telegramsiz brauzerda test qilish
    allowDevAuth: env !== 'production' && process.env.ALLOW_DEV_AUTH === 'true',
  },

  payments: {
    // BotFather -> Payments orqali olingan Payme/Click provider token
    providerToken: process.env.PAYMENT_PROVIDER_TOKEN || '',
  },

  order: {
    // Order Bump (qo'shimcha taklif) narxi, so'mda
    bumpPrice: toInt(process.env.ORDER_BUMP_PRICE, 5000),
    minTotal: toInt(process.env.MIN_ORDER_TOTAL, 0),
    maxItemQuantity: 50,
  },
};

if (!config.bot.token) {
  throw new Error('BOT_TOKEN .env faylida ko\'rsatilmagan');
}
if (!config.db.url) {
  throw new Error('DATABASE_URL .env faylida ko\'rsatilmagan');
}

module.exports = config;
