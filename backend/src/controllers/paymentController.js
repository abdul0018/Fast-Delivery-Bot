/**
 * Telegram Payments: Payme/Click (UZS)
 */
const { Markup } = require('telegraf');
const config = require('../config/default');
const { Order } = require('../models');
const { markOrderPaid, findOrderAwaitingReceipt, formatReceiptCaption } = require('./cartController');
const { t } = require('../utils/i18n');
const logger = require('../utils/logger');

const parsePayload = (payload) => {
  const match = /^order:(\d+)$/.exec(payload || '');
  return match ? Number(match[1]) : null;
};

/** To'lovdan oldin Telegram so'raydi — buyurtma hali amal qiladimi? (10 soniya ichida javob shart) */
async function preCheckout(ctx) {
  const query = ctx.preCheckoutQuery;
  const orderId = parsePayload(query.invoice_payload);
  const order = orderId ? await Order.findByPk(orderId) : null;

  const expectedAmount = order && order.total * 100;
  const ok =
    order &&
    order.paymentStatus === 'pending' &&
    order.status !== 'cancelled' &&
    query.total_amount === expectedAmount;

  if (ok) {
    await ctx.answerPreCheckoutQuery(true);
  } else {
    await ctx.answerPreCheckoutQuery(false, ctx.t ? ctx.t('errors.orderNotFound') : 'Order not found');
  }
}

/** To'lov muvaffaqiyatli o'tdi */
async function successfulPayment(ctx) {
  const payment = ctx.message.successful_payment;
  const orderId = parsePayload(payment.invoice_payload);
  if (!orderId) return;

  await markOrderPaid(orderId, payment.telegram_payment_charge_id);
  logger.info(`💳 Buyurtma #${orderId} to'landi (${payment.total_amount} ${payment.currency})`);
}

// ------------------------------------------------------------------ Kartaga o'tkazma: chek

/** Admin chek ostidagi tugmalar */
const receiptKeyboard = (orderId, lang = config.bot.adminLanguage) =>
  Markup.inlineKeyboard([
    [
      Markup.button.callback(t(lang, 'cardPayment.approve'), `pay:approve:${orderId}`),
      Markup.button.callback(t(lang, 'cardPayment.decline'), `pay:decline:${orderId}`),
    ],
  ]);

/**
 * Mijoz shaxsiy chatda rasm (yoki rasm-fayl) yubordi — kartaga o'tkazma chekimi?
 * Oxirgi to'lanmagan "karta" buyurtmasiga biriktiriladi va admin'ga tasdiqlash uchun yuboriladi.
 */
async function receiveReceipt(ctx) {
  if (ctx.chat?.type !== 'private') return;
  const message = ctx.message;
  const photo = message.photo?.[message.photo.length - 1];
  const document = message.document && /^image\/|pdf$/.test(message.document.mime_type || '') ? message.document : null;
  const fileId = photo?.file_id ?? document?.file_id;
  if (!fileId) return;

  const order = await findOrderAwaitingReceipt(ctx.state.user.id);
  if (!order) {
    await ctx.reply(ctx.t('cardPayment.noOrder'));
    return;
  }

  await order.update({ receiptFileId: fileId, paymentStatus: 'pending' });

  const adminChat = config.bot.adminChatId;
  const extra = { caption: formatReceiptCaption(order), parse_mode: 'HTML', ...receiptKeyboard(order.id) };
  try {
    if (photo) await ctx.telegram.sendPhoto(adminChat, fileId, extra);
    else await ctx.telegram.sendDocument(adminChat, fileId, extra);
  } catch (error) {
    logger.error(`Chek admin'ga yuborilmadi (#${order.id}):`, error.message);
  }
  await ctx.reply(ctx.t('cardPayment.received', { id: order.id }), { parse_mode: 'HTML' });
  logger.info(`🧾 Buyurtma #${order.id}: chek qabul qilindi`);
}

module.exports = { preCheckout, successfulPayment, receiveReceipt, receiptKeyboard };
