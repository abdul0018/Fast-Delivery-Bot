/**
 * /start, til tanlash va asosiy menyu logikasi
 */
const config = require('../config/default');
const { t } = require('../utils/i18n');
const { escapeHtml, formatPrice } = require('../utils/format');
const { languageKeyboard, mainKeyboard, openAppKeyboard, webAppUrl } = require('../utils/keyboards');
const { Order } = require('../models');
const logger = require('../utils/logger');

/** Chat uchun pastki chap "Menyu" tugmasini (Menu Button) Mini App'ga bog'lash */
async function setMenuButton(ctx, lang) {
  try {
    await ctx.telegram.setChatMenuButton({
      chatId: ctx.chat.id,
      menuButton: { type: 'web_app', text: t(lang, 'menuButton'), web_app: { url: webAppUrl(lang) } },
    });
  } catch (error) {
    logger.warn('Menu button o\'rnatilmadi:', error.message);
  }
}

/** Xush kelibsiz xabari + asosiy klaviatura + Mini App tugmasi */
async function sendWelcome(ctx) {
  const lang = ctx.state.lang;
  const name = escapeHtml(ctx.from.first_name || '');

  await setMenuButton(ctx, lang);
  // Reply klaviaturani o'rnatamiz, keyin Mini App'ni ochuvchi inline tugmani yuboramiz
  await ctx.reply(t(lang, 'start.welcome', { name }), { parse_mode: 'HTML', ...mainKeyboard(lang) });
  await ctx.reply(t(lang, 'start.openMenu'), openAppKeyboard(lang));
}

/** /start — til tanlanmagan bo'lsa avval tilni so'raymiz */
async function start(ctx) {
  if (ctx.chat.type !== 'private') return;

  if (!ctx.state.user.language) {
    await ctx.reply(t('uz', 'language.choose'), languageKeyboard());
    return;
  }
  await sendWelcome(ctx);
}

/** Til tugmasi bosilganda: lang:uz | lang:ru */
async function chooseLanguage(ctx) {
  const lang = ctx.match[1];
  await ctx.state.user.update({ language: lang });
  ctx.state.lang = lang;

  await ctx.answerCbQuery();
  await ctx.editMessageText(t(lang, 'language.changed')).catch(() => {});
  await sendWelcome(ctx);
}

/** "🌐 Tilni o'zgartirish" */
async function askLanguage(ctx) {
  await ctx.reply(t(ctx.state.lang, 'language.choose'), languageKeyboard());
}

/** "🍔 Menyu" matnli tugmasi — Mini App'ni ochuvchi inline tugma yuboradi */
async function openMenu(ctx) {
  await ctx.reply(ctx.t('start.openMenu'), openAppKeyboard(ctx.state.lang));
}

/** "📞 Aloqa" */
async function contactInfo(ctx) {
  await ctx.reply(ctx.t('contact.info', { phone: escapeHtml(config.bot.supportPhone) }), { parse_mode: 'HTML' });
}

/** Foydalanuvchi "📱 Raqamni yuborish" orqali kontaktini yuborganda */
async function savePhone(ctx) {
  const { contact } = ctx.message;
  // Faqat o'z raqamini qabul qilamiz
  if (contact.user_id !== ctx.from.id) return;

  const phone = contact.phone_number.startsWith('+') ? contact.phone_number : `+${contact.phone_number}`;
  await ctx.state.user.update({ phone });
  await ctx.reply(ctx.t('phone.saved', { phone }), mainKeyboard(ctx.state.lang));
}

/** "🛒 Buyurtmalarim" — so'nggi 5 ta buyurtma */
async function myOrders(ctx) {
  const lang = ctx.state.lang;
  const orders = await Order.findAll({
    where: { userId: ctx.state.user.id },
    order: [['createdAt', 'DESC']],
    limit: 5,
  });

  if (!orders.length) {
    await ctx.reply(t(lang, 'orders.empty'), openAppKeyboard(lang));
    return;
  }

  const locale = lang === 'ru' ? 'ru-RU' : 'uz-UZ';
  const lines = orders.map((order) =>
    t(lang, 'orders.item', {
      id: order.id,
      date: new Date(order.createdAt).toLocaleString(locale, { dateStyle: 'short', timeStyle: 'short' }),
      total: formatPrice(order.total),
      status: t(lang, `status.${order.status}`),
    }),
  );

  await ctx.reply(`${t(lang, 'orders.title')}\n\n${lines.join('\n\n')}`, { parse_mode: 'HTML' });
}

/** Tushunarsiz xabar */
async function fallback(ctx) {
  if (ctx.chat?.type !== 'private') return;
  await ctx.reply(ctx.t('unknown'), openAppKeyboard(ctx.state.lang));
}

module.exports = {
  start,
  chooseLanguage,
  askLanguage,
  openMenu,
  contactInfo,
  savePhone,
  myOrders,
  fallback,
  setMenuButton,
};
