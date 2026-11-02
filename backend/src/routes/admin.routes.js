/**
 * Admin panel API (sayt: <Mini App>/admin/) — Authorization: Bearer <token>
 *
 *  POST   /api/admin/login            — parol bilan kirish (ochiq)
 *  GET    /api/admin/products         — barcha mahsulotlar (yashirinlari ham)
 *  POST   /api/admin/products         — yangi mahsulot
 *  PATCH  /api/admin/products/:id     — tahrirlash (narx, rasm, nom, ko'rinish ...)
 *  DELETE /api/admin/products/:id     — o'chirish
 *  POST   /api/admin/images           — rasm yuklash (image/jpeg | png | webp, tanasi — fayl)
 *  GET    /api/admin/orders           — buyurtmalar (?status=&offset=&limit=)
 *  PATCH  /api/admin/orders/:id       — holatni o'zgartirish (mijozga xabar boradi)
 *  GET    /api/admin/stats?days=30    — statistika (Toshkent vaqti bilan)
 */
const crypto = require('crypto');
const express = require('express');
const { Op, QueryTypes } = require('sequelize');
const { Product, Order, User, Image } = require('../models');
const { sequelize } = require('../database/connection');
const { login, adminAuth } = require('../middlewares/admin.middleware');
const cartController = require('../controllers/cartController');
const { TRANSITIONS } = require('../controllers/adminController');
const logger = require('../utils/logger');

const router = express.Router();
const TZ = 'Asia/Tashkent';
const MAX_PRICE = 100_000_000;

class InputError extends Error {
  constructor(code, field) {
    super(code);
    this.code = code;
    this.field = field;
  }
}

const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (error) {
    if (error instanceof InputError) {
      res.status(400).json({ error: error.code, field: error.field });
      return;
    }
    if (error instanceof cartController.OrderError) {
      res.status(error.status).json({ error: error.code });
      return;
    }
    logger.error(`Admin API xatoligi ${req.method} ${req.originalUrl}:`, error);
    res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
};

router.post('/login', login);
router.use(adminAuth);

// ------------------------------------------------------------------ Mahsulotlar

const text = (value, field, max, { required = false } = {}) => {
  const result = value == null ? '' : String(value).trim();
  if (required && !result) throw new InputError('REQUIRED', field);
  if (result.length > max) throw new InputError('TOO_LONG', field);
  return result;
};

const money = (value, field, { required = false } = {}) => {
  if (value === null || value === '' || value === undefined) {
    if (required) throw new InputError('REQUIRED', field);
    return null;
  }
  const amount = Number(value);
  if (!Number.isInteger(amount) || amount < 0 || amount > MAX_PRICE) throw new InputError('INVALID_PRICE', field);
  return amount;
};

const list = (value, field) => {
  const items = Array.isArray(value) ? value : String(value ?? '').split(',');
  const result = items.map((item) => String(item).trim()).filter(Boolean);
  if (result.length > 30 || result.some((item) => item.length > 100)) throw new InputError('TOO_LONG', field);
  return result;
};

/** Rasm: sayt ichidagi fayl (/images/...), admin yuklagan rasm (/api/images/...) yoki https havola */
const imagePath = (value) => {
  const path = text(value, 'image', 500);
  if (!path) return null;
  if (/^\/(images|api\/images)\//.test(path) || /^https:\/\//.test(path)) return path;
  throw new InputError('INVALID_IMAGE', 'image');
};

const CYRILLIC = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm',
  н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch',
  ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya', ў: 'o', қ: 'q', ғ: 'g', ҳ: 'h',
};

const makeSlug = (name) => {
  const base = String(name)
    .toLowerCase()
    .split('')
    .map((char) => CYRILLIC[char] ?? char)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return `${base || 'product'}-${crypto.randomBytes(3).toString('hex')}`;
};

/** So'rov tanasidan mahsulot maydonlari. partial — faqat yuborilgan maydonlar (PATCH) */
function parseProduct(body = {}, { partial = false } = {}) {
  const has = (key) => !partial || body[key] !== undefined;
  const data = {};

  if (has('nameRu')) data.nameRu = text(body.nameRu, 'nameRu', 255, { required: true });
  if (has('nameUz')) data.nameUz = text(body.nameUz, 'nameUz', 255) || data.nameRu || undefined;
  if (has('descriptionRu')) data.descriptionRu = text(body.descriptionRu, 'descriptionRu', 2000);
  if (has('descriptionUz')) data.descriptionUz = text(body.descriptionUz, 'descriptionUz', 2000);
  if (has('ingredientsRu')) data.ingredientsRu = list(body.ingredientsRu, 'ingredientsRu');
  if (has('ingredientsUz')) data.ingredientsUz = list(body.ingredientsUz, 'ingredientsUz');
  if (has('price')) data.price = money(body.price, 'price', { required: true });
  if (has('oldPrice')) data.oldPrice = money(body.oldPrice, 'oldPrice');
  if (has('unitRu')) data.unitRu = text(body.unitRu, 'unitRu', 30) || null;
  if (has('unitUz')) data.unitUz = text(body.unitUz, 'unitUz', 30) || null;
  if (has('image')) data.image = imagePath(body.image);
  if (has('category')) {
    if (!Product.CATEGORIES.includes(body.category)) throw new InputError('INVALID_CATEGORY', 'category');
    data.category = body.category;
  }
  if (body.isActive !== undefined) data.isActive = Boolean(body.isActive);
  else if (!partial) data.isActive = true;
  if (body.isUpsell !== undefined) data.isUpsell = Boolean(body.isUpsell);
  if (body.sortOrder !== undefined) {
    const order = Number(body.sortOrder);
    if (!Number.isInteger(order) || Math.abs(order) > 100000) throw new InputError('INVALID_NUMBER', 'sortOrder');
    data.sortOrder = order;
  }
  if (data.nameUz === undefined) delete data.nameUz;
  return data;
}

/** Endi hech bir mahsulotda ishlatilmayotgan yuklangan rasmni o'chirish */
async function deleteImageIfUnused(path) {
  const id = Image.idFromPath(path);
  if (!id) return;
  const used = await Product.count({ where: { image: path } });
  if (!used) await Image.destroy({ where: { id } });
}

/** Savatchadagi taklif (Order Bump) — bir vaqtda faqat bitta mahsulot */
async function keepSingleUpsell(product) {
  if (product.isUpsell) {
    await Product.update({ isUpsell: false }, { where: { id: { [Op.ne]: product.id }, isUpsell: true } });
  }
}

router.get(
  '/products',
  handle(async (req, res) => {
    const products = await Product.findAll({
      order: [
        ['category', 'ASC'],
        ['sortOrder', 'ASC'],
        ['id', 'ASC'],
      ],
    });
    res.json({ products: products.map((product) => product.toAdminJSON()), categories: Product.CATEGORIES });
  }),
);

router.post(
  '/products',
  handle(async (req, res) => {
    const data = parseProduct(req.body);
    if (!data.category) throw new InputError('INVALID_CATEGORY', 'category');
    const product = await Product.create({ ...data, slug: makeSlug(data.nameUz || data.nameRu) });
    await keepSingleUpsell(product);
    logger.info(`Admin: yangi mahsulot #${product.id} "${product.nameRu}"`);
    res.status(201).json({ product: product.toAdminJSON() });
  }),
);

router.patch(
  '/products/:id',
  handle(async (req, res) => {
    const product = await Product.findByPk(Number(req.params.id));
    if (!product) return res.status(404).json({ error: 'NOT_FOUND' });

    const previousImage = product.image;
    const data = parseProduct(req.body, { partial: true });
    // Chegirmadagi eski narx yangi narxdan katta bo'lishi kerak
    const price = data.price ?? product.price;
    const oldPrice = data.oldPrice !== undefined ? data.oldPrice : product.oldPrice;
    if (oldPrice != null && oldPrice <= price) data.oldPrice = null;

    await product.update(data);
    await keepSingleUpsell(product);
    if (previousImage !== product.image) await deleteImageIfUnused(previousImage);
    return res.json({ product: product.toAdminJSON() });
  }),
);

router.delete(
  '/products/:id',
  handle(async (req, res) => {
    const product = await Product.findByPk(Number(req.params.id));
    if (!product) return res.status(404).json({ error: 'NOT_FOUND' });
    const { image } = product;
    // Buyurtmalar tarixi saqlanadi: ularda mahsulot nomi va narxi nusxa sifatida yozilgan
    await product.destroy();
    await deleteImageIfUnused(image);
    logger.info(`Admin: mahsulot #${product.id} o'chirildi`);
    return res.json({ ok: true });
  }),
);

// ------------------------------------------------------------------ Rasmlar

const IMAGE_SIGNATURES = [
  { mime: 'image/jpeg', test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { mime: 'image/png', test: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  { mime: 'image/webp', test: (b) => b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP' },
];

router.post(
  '/images',
  express.raw({ type: ['image/jpeg', 'image/png', 'image/webp'], limit: '3mb' }),
  handle(async (req, res) => {
    const body = req.body;
    if (!Buffer.isBuffer(body) || body.length < 100) return res.status(400).json({ error: 'INVALID_IMAGE' });
    // Fayl turini sarlavhaga emas, tarkibiga qarab aniqlaymiz
    const kind = IMAGE_SIGNATURES.find((signature) => signature.test(body));
    if (!kind) return res.status(400).json({ error: 'INVALID_IMAGE' });

    const image = await Image.create({ mimeType: kind.mime, size: body.length, data: body });
    return res.status(201).json({ path: Image.pathFor(image.id) });
  }),
);

// ------------------------------------------------------------------ Buyurtmalar

router.get(
  '/orders',
  handle(async (req, res) => {
    const where = {};
    if (req.query.status && Order.STATUSES.includes(req.query.status)) where.status = req.query.status;
    const limit = Math.min(Math.max(Number(req.query.limit) || 30, 1), 100);
    const offset = Math.max(Number(req.query.offset) || 0, 0);

    const { rows, count } = await Order.findAndCountAll({
      where,
      include: [{ model: User, as: 'user', attributes: ['id', 'telegramId', 'firstName', 'lastName', 'username', 'phone'] }],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    res.json({
      total: count,
      orders: rows.map((order) => ({
        ...order.toPublicJSON(),
        phone: order.phone,
        comment: order.comment,
        next: TRANSITIONS[order.status],
        customer: order.user
          ? {
              name: [order.user.firstName, order.user.lastName].filter(Boolean).join(' ') || null,
              username: order.user.username,
              telegramId: String(order.user.telegramId),
            }
          : null,
      })),
    });
  }),
);

router.patch(
  '/orders/:id',
  handle(async (req, res) => {
    const current = await Order.findByPk(Number(req.params.id));
    if (!current) return res.status(404).json({ error: 'NOT_FOUND' });
    const { status } = req.body || {};
    if (!TRANSITIONS[current.status].includes(status)) return res.status(400).json({ error: 'INVALID_STATUS' });

    const order = await cartController.updateOrderStatus(current.id, status);
    return res.json({ order: { ...order.toPublicJSON(), next: TRANSITIONS[order.status] } });
  }),
);

// ------------------------------------------------------------------ Statistika

const select = (sql, replacements) => sequelize.query(sql, { replacements, type: QueryTypes.SELECT });

router.get(
  '/stats',
  handle(async (req, res) => {
    const days = [7, 30, 90].includes(Number(req.query.days)) ? Number(req.query.days) : 30;
    const params = { tz: TZ, days };

    // Davr: bugundan (Toshkent vaqti) orqaga `days` kun; taqqoslash uchun undan oldingi xuddi shunday davr
    const periodStart = `(date_trunc('day', now() AT TIME ZONE :tz) - (:days - 1) * interval '1 day') AT TIME ZONE :tz`;
    const previousStart = `(date_trunc('day', now() AT TIME ZONE :tz) - (2 * :days - 1) * interval '1 day') AT TIME ZONE :tz`;
    const todayStart = `date_trunc('day', now() AT TIME ZONE :tz) AT TIME ZONE :tz`;

    const [summary] = await select(
      `SELECT
         COUNT(*) FILTER (WHERE created_at >= ${periodStart})::int                                   AS orders,
         COUNT(*) FILTER (WHERE created_at >= ${periodStart} AND status = 'cancelled')::int          AS cancelled,
         COALESCE(SUM(total) FILTER (WHERE created_at >= ${periodStart} AND status <> 'cancelled'), 0)::bigint AS revenue,
         COUNT(DISTINCT user_id) FILTER (WHERE created_at >= ${periodStart})::int                    AS customers,
         COUNT(*) FILTER (WHERE created_at >= ${previousStart} AND created_at < ${periodStart})::int AS prev_orders,
         COALESCE(SUM(total) FILTER (WHERE created_at >= ${previousStart} AND created_at < ${periodStart}
                                     AND status <> 'cancelled'), 0)::bigint                          AS prev_revenue,
         COUNT(*) FILTER (WHERE created_at >= ${todayStart})::int                                    AS today_orders,
         COALESCE(SUM(total) FILTER (WHERE created_at >= ${todayStart} AND status <> 'cancelled'), 0)::bigint AS today_revenue,
         COUNT(*) FILTER (WHERE status = 'new')::int                                                 AS pending
       FROM orders`,
      params,
    );

    const [users] = await select(
      `SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE created_at >= ${periodStart})::int AS new FROM users`,
      params,
    );

    const daily = await select(
      `SELECT to_char(day, 'YYYY-MM-DD') AS date,
              COUNT(o.id) FILTER (WHERE o.status <> 'cancelled')::int AS orders,
              COALESCE(SUM(o.total) FILTER (WHERE o.status <> 'cancelled'), 0)::bigint AS revenue
       FROM generate_series(date_trunc('day', now() AT TIME ZONE :tz) - (:days - 1) * interval '1 day',
                            date_trunc('day', now() AT TIME ZONE :tz), interval '1 day') AS day
       LEFT JOIN orders o ON date_trunc('day', o.created_at AT TIME ZONE :tz) = day
       GROUP BY day ORDER BY day`,
      params,
    );

    const statuses = await select(
      `SELECT status::text AS status, COUNT(*)::int AS count FROM orders
       WHERE created_at >= ${periodStart} GROUP BY status`,
      params,
    );

    const topProducts = await select(
      `SELECT (item->>'productId')::int AS "productId",
              MAX(item->>'nameRu') AS name,
              SUM((item->>'quantity')::int)::int AS quantity,
              SUM((item->>'quantity')::int * (item->>'price')::int)::bigint AS revenue
       FROM orders, jsonb_array_elements(items) AS item
       WHERE created_at >= ${periodStart} AND status <> 'cancelled'
       GROUP BY 1 ORDER BY revenue DESC LIMIT 8`,
      params,
    );

    const revenue = Number(summary.revenue);
    const paidOrders = summary.orders - summary.cancelled;
    res.json({
      days,
      summary: {
        orders: summary.orders,
        cancelled: summary.cancelled,
        revenue,
        averageCheck: paidOrders > 0 ? Math.round(revenue / paidOrders) : 0,
        customers: summary.customers,
        previousOrders: summary.prev_orders,
        previousRevenue: Number(summary.prev_revenue),
        todayOrders: summary.today_orders,
        todayRevenue: Number(summary.today_revenue),
        pending: summary.pending,
        totalUsers: users.total,
        newUsers: users.new,
      },
      daily: daily.map((row) => ({ date: row.date, orders: row.orders, revenue: Number(row.revenue) })),
      statuses: Object.fromEntries(statuses.map((row) => [row.status, row.count])),
      topProducts: topProducts.map((row) => ({ ...row, revenue: Number(row.revenue) })),
    });
  }),
);

module.exports = router;
