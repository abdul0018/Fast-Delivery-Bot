/**
 * Asosiy ishga tushirish fayli / Точка входа
 *  1. PostgreSQL ga ulanish va jadvallarni sinxronlash
 *  2. Mini App API (Express) ni ishga tushirish
 *  3. Telegram botni ishga tushirish (long polling)
 */
const config = require('./config/default');
const logger = require('./utils/logger');
const bot = require('./core/bot');
const { sequelize, connectDatabase } = require('./database/connection');
const { syncDatabase } = require('./database/sync');
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

async function main() {
  await connectDatabase();
  await syncDatabase({ alter: !config.isProduction });

  const server = createServer().listen(config.server.port, () => {
    logger.info(`🌐 API: http://localhost:${config.server.port}/api`);
  });

  registerBotRoutes(bot);
  await configureBotProfile().catch((error) => logger.warn('Bot profili sozlanmadi:', error.message));

  // launch() polling tugaguncha resolve bo'lmaydi, shuning uchun await qilmaymiz
  bot
    .launch({ allowedUpdates: ['message', 'callback_query', 'pre_checkout_query'] }, () => {
      logger.info(`🤖 Bot ishga tushdi: @${bot.botInfo?.username}`);
    })
    .catch((error) => {
      logger.error('Bot ishga tushmadi:', error);
      process.exit(1);
    });

  const shutdown = async (signal) => {
    logger.info(`${signal} — to'xtatilmoqda...`);
    bot.stop(signal);
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
