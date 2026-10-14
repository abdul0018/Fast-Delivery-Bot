/**
 * Admin guruhidagi buyurtma tugmalari: order:<status>:<id>
 */
const config = require('../config/default');
const { t } = require('../utils/i18n');
const { adminOrderKeyboard } = require('../utils/keyboards');
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

module.exports = { changeOrderStatus, TRANSITIONS };
