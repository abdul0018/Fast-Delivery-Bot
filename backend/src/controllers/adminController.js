/**
 * Admin guruhidagi buyurtma tugmalari: order:<status>:<id>
 */
const config = require('../config/default');
const { t } = require('../utils/i18n');
const { Markup } = require('telegraf');
const { adminOrderKeyboard, adminPanelUrl } = require('../utils/keyboards');
const { updateOrderStatus, formatOrderForAdmin, loadOrder } = require('./cartController');

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

/** /admin — admin guruhida admin panel (sayt) havolasini yuboradi */
async function adminPanel(ctx) {
  if (!isAdminChat(ctx)) return;
  const lang = config.bot.adminLanguage;
  if (!config.admin.password) {
    await ctx.reply(t(lang, 'admin.panelDisabled'));
    return;
  }
  await ctx.reply(t(lang, 'admin.panelText'), Markup.inlineKeyboard([[Markup.button.url(t(lang, 'admin.panelButton'), adminPanelUrl())]]));
}

module.exports = { changeOrderStatus, adminPanel, TRANSITIONS };
