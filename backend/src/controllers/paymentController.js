/**
 * Telegram Payments: Payme/Click (UZS)
 */
const { Order } = require('../models');
const { markOrderPaid } = require('./cartController');
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

module.exports = { preCheckout, successfulPayment };
