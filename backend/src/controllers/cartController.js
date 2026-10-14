/**
 * Savatcha va buyurtma logikasi / Логика корзины и заказов
 *
 * Narxlar HECH QACHON frontenddan olinmaydi — har doim bazadagi narx bo'yicha qayta hisoblanadi.
 */
const config = require('../config/default');
const bot = require('../core/bot');
const { sequelize } = require('../database/connection');
const { Product, Order, User } = require('../models');
const { t } = require('../utils/i18n');
const { formatPrice, escapeHtml } = require('../utils/format');
const { adminOrderKeyboard, openAppKeyboard } = require('../utils/keyboards');
const logger = require('../utils/logger');

/** API javobida qaytariladigan biznes xatolik */
class OrderError extends Error {
  constructor(code, status = 400) {
    super(code);
    this.code = code;
    this.status = status;
  }
}

/** Hozir faol bo'lgan to'lov usullari */
function availablePaymentMethods() {
  const methods = ['cash', 'stars'];
  if (config.payments.providerToken) methods.splice(1, 0, 'payme_click');
  return methods;
}

/** Order Bump uchun mahsulot (masalan, Coca-Cola) */
const findBumpProduct = () =>
  Product.findOne({ where: { isUpsell: true, isActive: true }, order: [['sortOrder', 'ASC']] });

/**
 * Savatchani tekshirish va summani hisoblash.
 * @param {{ productId: number, quantity: number }[]} items
 * @param {boolean} withBump
 */
async function calculateCart(items, withBump) {
  if (!Array.isArray(items) || items.length === 0) throw new OrderError('CART_EMPTY');
  if (items.length > 30) throw new OrderError('CART_TOO_LARGE');

  // Bir xil mahsulotlarni birlashtiramiz
  const quantities = new Map();
  for (const item of items) {
    const productId = Number(item?.productId);
    const quantity = Number(item?.quantity);
    if (!Number.isInteger(productId) || !Number.isInteger(quantity) || quantity < 1) {
      throw new OrderError('INVALID_ITEM');
    }
    const next = (quantities.get(productId) || 0) + quantity;
    if (next > config.order.maxItemQuantity) throw new OrderError('INVALID_ITEM');
    quantities.set(productId, next);
  }

  const products = await Product.findAll({ where: { id: [...quantities.keys()], isActive: true } });
  if (products.length !== quantities.size) throw new OrderError('PRODUCT_UNAVAILABLE');

  const lines = products.map((product) => ({
    productId: product.id,
    nameUz: product.nameUz,
    nameRu: product.nameRu,
    price: product.price,
    quantity: quantities.get(product.id),
  }));
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);

  let bumpProduct = null;
  if (withBump) {
    bumpProduct = await findBumpProduct();
    if (!bumpProduct) throw new OrderError('BUMP_UNAVAILABLE');
  }
  const bumpPrice = bumpProduct ? config.order.bumpPrice : 0;

  return { lines, subtotal, bumpProduct, bumpPrice, total: subtotal + bumpPrice };
}

// ------------------------------------------------------------------ Xabarlar

const productName = (line, lang) => (lang === 'ru' ? line.nameRu : line.nameUz);

/** Admin (yoki guruh) uchun buyurtma matni */
function formatOrderForAdmin(order, user, bumpProduct, lang = config.bot.adminLanguage) {
  const currency = t(lang, 'currency');
  const customer = [user.firstName, user.lastName].filter(Boolean).join(' ') || '—';
  const username = user.username ? ` (@${escapeHtml(user.username)})` : '';

  const items = order.items.map(
    (line) =>
      `• ${escapeHtml(productName(line, lang))} × ${line.quantity} = ${formatPrice(line.price * line.quantity)} ${currency}`,
  );
  if (order.bumpPrice > 0 && bumpProduct) {
    items.push(
      `➕ ${escapeHtml(productName(bumpProduct, lang))} (${t(lang, 'admin.bump')}) = ${formatPrice(order.bumpPrice)} ${currency}`,
    );
  }

  return [
    t(lang, 'admin.newOrder', { id: order.id }),
    '',
    `${t(lang, 'admin.customer')}: <a href="tg://user?id=${user.telegramId}">${escapeHtml(customer)}</a>${username}`,
    `${t(lang, 'admin.phone')}: ${escapeHtml(order.phone || user.phone || '—')}`,
    `${t(lang, 'admin.address')}: ${escapeHtml(order.address)}`,
    order.comment ? `${t(lang, 'admin.comment')}: ${escapeHtml(order.comment)}` : null,
    '',
    `<b>${t(lang, 'admin.items')}:</b>`,
    ...items,
    '',
    `${t(lang, 'admin.total')}: <b>${formatPrice(order.total)} ${currency}</b>`,
    `${t(lang, 'admin.payment')}: ${t(lang, `payment.${order.paymentMethod}`)} (${t(lang, `paymentStatus.${order.paymentStatus}`)})`,
    `${t(lang, 'admin.status')}: ${t(lang, `status.${order.status}`)}`,
  ]
    .filter((line) => line !== null)
    .join('\n');
}

/** Buyurtma va unga bog'liq ma'lumotlarni yuklash */
const loadOrder = (orderId) =>
  Order.findByPk(orderId, {
    include: [
      { model: User, as: 'user' },
      { model: Product, as: 'bumpProduct' },
    ],
  });

/** Admin chatiga yangi buyurtma haqida xabar */
async function notifyAdmin(order) {
  if (!config.bot.adminChatId) {
    logger.warn(`ADMIN_CHAT_ID ko'rsatilmagan — buyurtma #${order.id} haqida xabar yuborilmadi`);
    return;
  }
  try {
    await bot.telegram.sendMessage(config.bot.adminChatId, formatOrderForAdmin(order, order.user, order.bumpProduct), {
      parse_mode: 'HTML',
      ...adminOrderKeyboard(order),
    });
  } catch (error) {
    logger.error(`Admin'ga xabar yuborilmadi (#${order.id}):`, error.message);
  }
}

/** Mijozga uning tilida xabar */
async function notifyUser(user, key, params, extra = {}) {
  const lang = user.language || 'uz';
  try {
    await bot.telegram.sendMessage(String(user.telegramId), t(lang, key, params), { parse_mode: 'HTML', ...extra });
  } catch (error) {
    logger.warn(`Foydalanuvchiga xabar yuborilmadi (${user.telegramId}):`, error.message);
  }
}

// ------------------------------------------------------------------ To'lov (invoice)

/** Telegram Stars (XTR) yoki Payme/Click (UZS) uchun to'lov havolasi */
async function createInvoiceLink(order, lang) {
  const count = order.items.reduce((sum, line) => sum + line.quantity, 0) + (order.bumpPrice > 0 ? 1 : 0);
  const base = {
    title: t(lang, 'invoice.title', { id: order.id }),
    description: t(lang, 'invoice.description', { count }),
    payload: `order:${order.id}`,
  };

  if (order.paymentMethod === 'stars') {
    return bot.telegram.createInvoiceLink({
      ...base,
      provider_token: '',
      currency: 'XTR',
      prices: [{ label: t(lang, 'invoice.label'), amount: order.starsAmount }],
    });
  }

  // Payme / Click — BotFather'da ulangan provider orqali; summa tiyinda (×100)
  return bot.telegram.createInvoiceLink({
    ...base,
    provider_token: config.payments.providerToken,
    currency: 'UZS',
    prices: [{ label: t(lang, 'invoice.label'), amount: order.total * 100 }],
  });
}

// ------------------------------------------------------------------ Asosiy amallar

/**
 * Mini App'dan kelgan buyurtmani yaratish.
 * @returns {{ order: Order, invoiceUrl: string | null }}
 */
async function createOrder(user, lang, payload) {
  const { items, bump = false, paymentMethod, address, phone, comment } = payload || {};

  if (!availablePaymentMethods().includes(paymentMethod)) throw new OrderError('PAYMENT_UNAVAILABLE');

  const cleanAddress = String(address || '').trim();
  if (cleanAddress.length < 5 || cleanAddress.length > 500) throw new OrderError('INVALID_ADDRESS');
  const cleanPhone = phone ? String(phone).trim().slice(0, 32) : user.phone;
  const cleanComment = comment ? String(comment).trim().slice(0, 500) : null;

  const cart = await calculateCart(items, Boolean(bump));
  if (cart.total < config.order.minTotal) throw new OrderError('MIN_TOTAL');

  const isOnline = paymentMethod !== 'cash';

  const order = await sequelize.transaction(async (transaction) => {
    const created = await Order.create(
      {
        userId: user.id,
        items: cart.lines,
        subtotal: cart.subtotal,
        bumpProductId: cart.bumpProduct?.id ?? null,
        bumpPrice: cart.bumpPrice,
        total: cart.total,
        paymentMethod,
        paymentStatus: 'pending',
        status: 'new',
        address: cleanAddress,
        phone: cleanPhone,
        comment: cleanComment,
        starsAmount: paymentMethod === 'stars' ? Math.max(1, Math.ceil(cart.total / config.payments.starsRateUzs)) : null,
      },
      { transaction },
    );
    // Keyingi buyurtmalar uchun manzil va telefonni eslab qolamiz
    await user.update({ address: cleanAddress, phone: cleanPhone || user.phone }, { transaction });
    return created;
  });

  const fullOrder = await loadOrder(order.id);

  if (!isOnline) {
    // Naqd to'lov: admin va mijozga xabar fonda yuboriladi (API javobi kutib qolmasligi uchun).
    // Ikkala funksiya ham xatolarni o'zi ushlaydi.
    void notifyAdmin(fullOrder);
    void notifyUser(user, 'order.created', {
      id: order.id,
      total: formatPrice(order.total),
      payment: t(lang, `payment.${paymentMethod}`),
      address: escapeHtml(cleanAddress),
    });
    return { order: fullOrder, invoiceUrl: null };
  }

  // Onlayn to'lov: admin'ga xabar to'lov tasdiqlangandan keyin yuboriladi (paymentController)
  try {
    const invoiceUrl = await createInvoiceLink(fullOrder, lang);
    return { order: fullOrder, invoiceUrl };
  } catch (error) {
    logger.error(`Invoice yaratilmadi (#${order.id}):`, error.message);
    await fullOrder.update({ paymentStatus: 'failed', status: 'cancelled' });
    throw new OrderError('PAYMENT_FAILED', 502);
  }
}

/** To'lov muvaffaqiyatli bo'lganda (successful_payment) */
async function markOrderPaid(orderId, chargeId) {
  const order = await loadOrder(orderId);
  if (!order || order.paymentStatus === 'paid') return order;

  await order.update({ paymentStatus: 'paid', paymentChargeId: chargeId });
  await notifyAdmin(order);
  await notifyUser(order.user, 'order.paid', { id: order.id }, openAppKeyboard(order.user.language || 'uz'));
  return order;
}

/** Admin holatni o'zgartirganda: mijozga xabar yuboriladi */
async function updateOrderStatus(orderId, status) {
  const order = await loadOrder(orderId);
  if (!order) throw new OrderError('ORDER_NOT_FOUND', 404);
  if (order.status === status) return order;

  await order.update({ status });
  const lang = order.user.language || 'uz';
  await notifyUser(order.user, 'order.statusChanged', { id: order.id, status: t(lang, `status.${status}`) });
  return order;
}

module.exports = {
  OrderError,
  availablePaymentMethods,
  findBumpProduct,
  calculateCart,
  createOrder,
  markOrderPaid,
  updateOrderStatus,
  formatOrderForAdmin,
  loadOrder,
};
