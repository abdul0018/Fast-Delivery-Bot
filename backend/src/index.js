/**
 * Asosiy ishga tushirish fayli / Точка входа
 *  1. PostgreSQL ga ulanish va jadvallarni sinxronlash
 *  2. Mini App API (Express) ni ishga tushirish
 *  3. Telegram botni ishga tushirish:
 *       - WEBHOOK_DOMAIN berilgan bo'lsa — webhook (Render/Railway kabi hostinglar)
 *       - aks holda — long polling (VPS, lokal)
 */
const config = require('./config/default');
const logger = require('./utils/logger');
const bot = require('./core/bot');
const { sequelize, connectDatabase } = require('./database/connection');
const { syncDatabase } = require('./database/sync');
const { seedProducts } = require('./database/seed');
const { Product } = require('./models');
const { registerBotRoutes } = require('./routes/bot.routes');
const { createServer } = require('./server');
const { t } = require('./utils/i18n');
const { webAppUrl } = require('./utils/keyboards');

async function configureBotProfile() {
  // Standart "Menyu" tugmasi (chat ichida pastki chap burchakda) — Mini App'ni ochadi
  await bot.telegram.setChatMenuButton({
    menuButton: { type: 'web_app', text: t('uz', 'menuButton'), web_app: { url: webAppUrl('uz') } },
  });

  // Komandalar ro'yxati har bir til uchun alohida
  const commands = {
    uz: [
      { command: 'start', description: 'Botni ishga tushirish' },
      { command: 'menu', description: 'Menyuni ochish' },
      { command: 'orders', description: 'Buyurtmalarim' },
      { command: 'lang', description: "Tilni o'zgartirish" },
    ],
    ru: [
      { command: 'start', description: 'Запустить бота' },
      { command: 'menu', description: 'Открыть меню' },
      { command: 'orders', description: 'Мои заказы' },
      { command: 'lang', description: 'Сменить язык' },
    ],
  };
  await bot.telegram.setMyCommands(commands.uz);
  await bot.telegram.setMyCommands(commands.ru, { language_code: 'ru' });
}

const ALLOWED_UPDATES = ['message', 'callback_query', 'pre_checkout_query'];
const WEBHOOK_PATH = '/telegram/webhook';

async function main() {
  await connectDatabase();
  // Production'da faqat yetishmayotgan jadvallar yaratiladi (mavjud ma'lumotlarga tegilmaydi)
  await syncDatabase({ alter: !config.isProduction });

  // Birinchi ishga tushirishda menyu bo'sh bo'lsa — namuna mahsulotlarni qo'shamiz
  if ((await Product.count()) === 0) await seedProducts();

  registerBotRoutes(bot);

  // Webhook rejimi: Telegram yangilanishlarni HTTPS orqali shu serverga yuboradi
  let webhook = null;
  if (config.bot.webhookDomain) {
    webhook = {
      path: WEBHOOK_PATH,
      handler: await bot.createWebhook({
        domain: config.bot.webhookDomain,
        path: WEBHOOK_PATH,
        secret_token: config.bot.webhookSecret,
        allowed_updates: ALLOWED_UPDATES,
        // Server o'chiq paytida yig'ilib qolgan eski xabarlarga (masalan, 12 ta /start) qayta-qayta javob bermaymiz
        drop_pending_updates: true,
      }),
    };
  }

  const server = createServer({ webhook }).listen(config.server.port, () => {
    logger.info(`🌐 API: port ${config.server.port}, /api`);
  });

  await configureBotProfile().catch((error) => logger.warn('Bot profili sozlanmadi:', error.message));
  if (!config.bot.adminChatId) {
    logger.warn("❗ ADMIN_CHAT_ID ko'rsatilmagan: botni admin guruhga qo'shing, guruhda /id yuboring va javobni .env ga yozing");
  }

  if (webhook) {
    bot.botInfo ??= await bot.telegram.getMe();
    logger.info(`🤖 Bot ishga tushdi (webhook): @${bot.botInfo.username} → ${config.bot.webhookDomain}${WEBHOOK_PATH}`);
  } else {
    // launch() polling tugaguncha resolve bo'lmaydi, shuning uchun await qilmaymiz.
    // Eslatma: bitta token bilan bir vaqtda faqat BITTA nusxa polling qila oladi.
    bot
      .launch({ allowedUpdates: ALLOWED_UPDATES, dropPendingUpdates: true }, () => {
        logger.info(`🤖 Bot ishga tushdi (long polling): @${bot.botInfo?.username}`);
      })
      .catch((error) => {
        logger.error('Bot ishga tushmadi:', error);
        process.exit(1);
      });
  }

  const shutdown = async (signal) => {
    logger.info(`${signal} — to'xtatilmoqda...`);
    if (!webhook) bot.stop(signal);
    server.close();
    await sequelize.close();
    process.exit(0);
  };
  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch((error) => {
  logger.error('Ishga tushirishda xatolik:', error);
  process.exit(1);
});
