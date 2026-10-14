/**
 * Mini App uchun REST API
 *
 *  GET   /api/health
 *  GET   /api/config      — to'lov usullari, Order Bump narxi (ochiq)
 *  GET   /api/products    — faol mahsulotlar (ochiq)
 *  GET   /api/me          — joriy foydalanuvchi            (initData)
 *  PATCH /api/me          — til / telefon / manzil         (initData)
 *  GET   /api/orders      — foydalanuvchi buyurtmalari     (initData)
 *  POST  /api/orders      — yangi buyurtma                 (initData)
 */
const express = require('express');
const config = require('../config/default');
const { Product, Order } = require('../models');
const { webAppAuth } = require('../middlewares/auth.middleware');
const { SUPPORTED_LANGUAGES } = require('../utils/i18n');
const cartController = require('../controllers/cartController');
const logger = require('../utils/logger');

const router = express.Router();

/** async handler xatolarini bitta joyda ushlash */
const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (error) {
    if (error instanceof cartController.OrderError) {
      res.status(error.status).json({ error: error.code });
      return;
    }
    logger.error(`API xatoligi ${req.method} ${req.originalUrl}:`, error);
    res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
};

router.get('/health', (req, res) => res.json({ ok: true }));

router.get(
  '/config',
  handle(async (req, res) => {
    const bumpProduct = await cartController.findBumpProduct();
    res.json({
      currency: 'UZS',
      paymentMethods: cartController.availablePaymentMethods(),
      starsRateUzs: config.payments.starsRateUzs,
      bump: bumpProduct ? { product: bumpProduct.toPublicJSON(), price: config.order.bumpPrice } : null,
    });
  }),
);

router.get(
  '/products',
  handle(async (req, res) => {
    const products = await Product.findAll({
      where: { isActive: true },
      order: [
        ['category', 'ASC'],
        ['sortOrder', 'ASC'],
        ['id', 'ASC'],
      ],
    });
    res.json({ products: products.map((product) => product.toPublicJSON()) });
  }),
);

router.get(
  '/me',
  webAppAuth,
  handle(async (req, res) => {
    res.json({ user: { ...req.user.toPublicJSON(), language: req.user.language || req.lang } });
  }),
);

router.patch(
  '/me',
  webAppAuth,
  handle(async (req, res) => {
    const { language, phone, address } = req.body || {};
    const updates = {};
    if (language !== undefined) {
      if (!SUPPORTED_LANGUAGES.includes(language)) return res.status(400).json({ error: 'INVALID_LANGUAGE' });
      updates.language = language;
    }
    if (phone !== undefined) updates.phone = String(phone).trim().slice(0, 32) || null;
    if (address !== undefined) updates.address = String(address).trim().slice(0, 500) || null;

    await req.user.update(updates);
    return res.json({ user: req.user.toPublicJSON() });
  }),
);

router.get(
  '/orders',
  webAppAuth,
  handle(async (req, res) => {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 20,
    });
    res.json({ orders: orders.map((order) => order.toPublicJSON()) });
  }),
);

router.post(
  '/orders',
  webAppAuth,
  handle(async (req, res) => {
    const { order, invoiceUrl } = await cartController.createOrder(req.user, req.lang, req.body);
    res.status(201).json({ order: order.toPublicJSON(), invoiceUrl });
  }),
);

module.exports = router;
