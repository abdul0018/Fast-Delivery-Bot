/**
 * Admin guruhidagi buyurtma tugmalari: order:<status>:<id>
 */
const config = require('../config/default');
const { t } = require('../utils/i18n');
const { Markup } = require('telegraf');
const { adminOrderKeyboard, adminPanelUrl } = require('../utils/keyboards');
const { isAdmin } = require('../utils/admins');
const { updateOrderStatus, formatOrderForAdmin, loadOrder, reviewCardPayment, formatReceiptCaption, OrderError } = require('./cartController');

// Ruxsat etilgan holat o'tishlari
const TRANSITIONS = {
  new: ['confirmed', 'cancelled'],
  confirmed: ['delivering', 'cancelled'],
  delivering: ['completed'],
  completed: [],
  cancelled: [],
};

const isAdminChat = (ctx) => config.bot.adminChatId && String(ctx.chat?.id) === String(config.bot.adminChatId);

async function changeOrderStatus(ctx) {
  const lang = config.bot.adminLanguage;
  if (!isAdminChat(ctx)) {
    await ctx.answerCbQuery(t(lang, 'admin.notAllowed'), { show_alert: true });
    return;
  }

  const [, status, rawId] = ctx.match;
  const current = await loadOrder(Number(rawId));
  if (!current) {
    await ctx.answerCbQuery(t(lang, 'errors.orderNotFound'), { show_alert: true });
    return;
  }
  if (!TRANSITIONS[current.status].includes(status)) {
    await ctx.answerCbQuery();
    return;
  }

  const order = await updateOrderStatus(current.id, status);
  await ctx.answerCbQuery(t(lang, 'admin.updated'));
  await ctx.editMessageText(formatOrderForAdmin(order, order.user, order.bumpProduct), {
    parse_mode: 'HTML',
    ...adminOrderKeyboard(order),
  });
}

/** Chek ostidagi tugma: pay:(approve|decline):<id> — to'lovni tasdiqlash yoki rad etish */
async function reviewPayment(ctx) {
  const lang = config.bot.adminLanguage;
  if (!isAdminChat(ctx) && !(await isAdmin(ctx.from?.id))) {
    await ctx.answerCbQuery(t(lang, 'admin.notAllowed'), { show_alert: true });
    return;
  }
  const [, action, rawId] = ctx.match;
  try {
    const { order, changed } = await reviewCardPayment(Number(rawId), action === 'approve');
    await ctx.answerCbQuery(changed ? t(lang, 'admin.updated') : t(lang, 'cardPayment.alreadyPaid'));
    const result = order.paymentStatus === 'paid' ? t(lang, 'cardPayment.approvedMark') : t(lang, 'cardPayment.declinedMark');
    // Chek izohiga natija yoziladi, tugmalar olib tashlanadi (qayta bosilmasin)
    await ctx
      .editMessageCaption(`${formatReceiptCaption(order)}\n\n${result}`, { parse_mode: 'HTML', reply_markup: undefined })
      .catch(() => ctx.editMessageReplyMarkup(undefined).catch(() => {}));
  } catch (error) {
    if (error instanceof OrderError) {
      await ctx.answerCbQuery(t(lang, 'errors.orderNotFound'), { show_alert: true });
      return;
    }
    throw error;
  }
}

/**
 * /admin — admin panel (parolsiz):
 *  - shaxsiy chatda admin uchun: panelni Telegram ichida ochuvchi tugma (Telegram foydalanuvchini o'zi tasdiqlaydi)
 *  - buyurtmalar guruhida: botning shaxsiy chatiga havola (web_app tugmalari faqat shaxsiy chatda ishlaydi)
 */
async function adminPanel(ctx) {
  const lang = config.bot.adminLanguage;

  if (ctx.chat?.type === 'private') {
    if (!(await isAdmin(ctx.from?.id))) {
      await ctx.reply(t(lang, 'admin.panelDenied', { id: ctx.from?.id ?? '' }));
      return;
    }
    await ctx.reply(t(lang, 'admin.panelText'), Markup.inlineKeyboard([[Markup.button.webApp(t(lang, 'admin.panelButton'), adminPanelUrl())]]));
    return;
  }

  if (!isAdminChat(ctx)) return;
  const username = ctx.botInfo?.username;
  if (!username) return;
  await ctx.reply(
    t(lang, 'admin.panelGroup'),
    Markup.inlineKeyboard([[Markup.button.url(t(lang, 'admin.panelButton'), `https://t.me/${username}?start=admin`)]]),
  );
}

module.exports = { changeOrderStatus, adminPanel, reviewPayment, TRANSITIONS };
