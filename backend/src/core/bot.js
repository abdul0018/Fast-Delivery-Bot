/**
 * Telegraf bot instansiyasi (yagona nusxa) / Единственный экземпляр бота
 */
const { Telegraf } = require('telegraf');
const config = require('../config/default');
const logger = require('../utils/logger');

const bot = new Telegraf(config.bot.token, {
  handlerTimeout: 30_000,
});

// Handler ichidagi kutilmagan xatoliklar botni to'xtatib qo'ymasligi uchun
bot.catch(async (error, ctx) => {
  logger.error(`Bot xatoligi (${ctx.updateType}):`, error);
  try {
    if (ctx.callbackQuery) await ctx.answerCbQuery().catch(() => {});
    if (ctx.chat && ctx.t) await ctx.reply(ctx.t('errors.generic'));
  } catch {
    /* javob yuborib bo'lmasa — e'tiborsiz qoldiramiz */
  }
});

module.exports = bot;
