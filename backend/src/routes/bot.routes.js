/**
 * Bot handlerlari ro'yxati / Регистрация обработчиков бота
 * Tartib muhim: middleware -> komandalar -> callback'lar -> matnli tugmalar -> fallback
 */
const { message } = require('telegraf/filters');
const { botAuth } = require('../middlewares/auth.middleware');
const { allTranslations } = require('../utils/i18n');
const startController = require('../controllers/startController');
const adminController = require('../controllers/adminController');
const paymentController = require('../controllers/paymentController');

function registerBotRoutes(bot) {
  bot.use(botAuth);

  // Komandalar
  bot.start(startController.start);
  bot.command('menu', startController.openMenu);
  bot.command('lang', startController.askLanguage);
  bot.command('orders', startController.myOrders);
  // Admin sozlash uchun: guruhda /id — shu chat ID sini ko'rsatadi (ADMIN_CHAT_ID ga yoziladi)
  bot.command('id', startController.chatId);

  // Inline tugmalar
  bot.action(/^lang:(uz|ru)$/, startController.chooseLanguage);
  bot.action(/^order:(confirmed|delivering|completed|cancelled):(\d+)$/, adminController.changeOrderStatus);

  // To'lovlar
  bot.on('pre_checkout_query', paymentController.preCheckout);
  bot.on(message('successful_payment'), paymentController.successfulPayment);

  // Kontakt (telefon raqam)
  bot.on(message('contact'), startController.savePhone);

  // Reply klaviatura tugmalari — ikkala tildagi matnlar ham ishlaydi
  bot.hears(allTranslations('buttons.menu'), startController.openMenu);
  bot.hears(allTranslations('buttons.orders'), startController.myOrders);
  bot.hears(allTranslations('buttons.contact'), startController.contactInfo);
  bot.hears(allTranslations('buttons.language'), startController.askLanguage);

  bot.on(message('text'), startController.fallback);
}

module.exports = { registerBotRoutes };
