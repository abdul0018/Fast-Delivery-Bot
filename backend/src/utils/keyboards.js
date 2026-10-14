/**
 * Bot klaviaturalari / Клавиатуры бота
 */
const { Markup } = require('telegraf');
const config = require('../config/default');
const { t } = require('./i18n');

/** Mini App manziliga til parametrini qo'shish (?lang=uz) */
const webAppUrl = (lang) => {
  const url = new URL(config.bot.webAppUrl);
  url.searchParams.set('lang', lang);
  return url.toString();
};

/** Til tanlash (inline) */
const languageKeyboard = () =>
  Markup.inlineKeyboard([
    [Markup.button.callback("🇺🇿 O'zbekcha", 'lang:uz'), Markup.button.callback('🇷🇺 Русский', 'lang:ru')],
  ]);

/**
 * Asosiy pastki menyu (reply keyboard).
 * Eslatma: Mini App inline tugma / menyu tugmasi orqali ochiladi — reply keyboard'dagi
 * web_app tugmasi initData (foydalanuvchi ma'lumoti) yubormaydi.
 */
const mainKeyboard = (lang) =>
  Markup.keyboard([
    [t(lang, 'buttons.menu')],
    [t(lang, 'buttons.orders'), t(lang, 'buttons.contact')],
    [t(lang, 'buttons.language'), Markup.button.contactRequest(t(lang, 'buttons.sharePhone'))],
  ]).resize();

/** Mini App'ni ochuvchi inline tugma */
const openAppKeyboard = (lang) =>
  Markup.inlineKeyboard([[Markup.button.webApp(t(lang, 'buttons.openApp'), webAppUrl(lang))]]);

/** Admin uchun buyurtma holatini boshqarish tugmalari */
const adminOrderKeyboard = (order, lang = config.bot.adminLanguage) => {
  const btn = (key, action) => Markup.button.callback(t(lang, `admin.${key}`), `order:${action}:${order.id}`);

  switch (order.status) {
    case 'new':
      return Markup.inlineKeyboard([[btn('confirm', 'confirmed'), btn('cancel', 'cancelled')]]);
    case 'confirmed':
      return Markup.inlineKeyboard([[btn('deliver', 'delivering'), btn('cancel', 'cancelled')]]);
    case 'delivering':
      return Markup.inlineKeyboard([[btn('complete', 'completed')]]);
    default:
      return Markup.inlineKeyboard([]);
  }
};

module.exports = { languageKeyboard, mainKeyboard, openAppKeyboard, adminOrderKeyboard, webAppUrl };
