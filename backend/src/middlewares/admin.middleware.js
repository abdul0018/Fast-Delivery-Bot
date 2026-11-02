/**
 * Admin panel autentifikatsiyasi / Аутентификация админ-панели
 *
 *  - Asosiy yo'l — parolsiz, Telegram orqali: botda /admin → "Открыть админ-панель" tugmasi →
 *    panel Telegram ichida ochiladi, Telegram imzolagan initData tekshiriladi va foydalanuvchi admin bo'lsa
 *    (buyurtmalar guruhi a'zosi yoki ADMIN_IDS) kirish tokeni beriladi.
 *  - Ixtiyoriy — brauzerdan parol bilan (ADMIN_PASSWORD berilgan bo'lsa).
 *  - Token: "<payload>.<hmac>" (Authorization: Bearer <token>). Kalit bot tokeni + paroldan hosil qilinadi.
 *    Telegram tokenida foydalanuvchi ID si bor — har so'rovda admin ekanligi qayta tekshiriladi (5 daqiqalik kesh),
 *    shuning uchun guruhdan chiqarilgan odam panelga kira olmay qoladi.
 */
const crypto = require('crypto');
const config = require('../config/default');
const { validateInitData } = require('./auth.middleware');
const { isAdmin, hasAdminSource } = require('../utils/admins');
const bot = require('../core/bot');
const logger = require('../utils/logger');

const DAY = 24 * 60 * 60 * 1000;
const TELEGRAM_SESSION_DAYS = 7;

const signingKey = () =>
  crypto.createHash('sha256').update(`admin-session:${config.bot.token}:${config.admin.password}`).digest();

const sign = (payload) => crypto.createHmac('sha256', signingKey()).update(payload).digest('base64url');

const safeEqual = (a, b) => {
  const left = crypto.createHash('sha256').update(String(a)).digest();
  const right = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(left, right);
};

/** @param {{ tg?: string }} [claims] tg — Telegram foydalanuvchi ID si (Telegram orqali kirganda) */
function createAdminToken(claims = {}, days = config.admin.sessionDays) {
  const payload = Buffer.from(JSON.stringify({ ...claims, exp: Date.now() + days * DAY })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

/** Token to'g'ri bo'lsa uning ma'lumotlari, aks holda null */
function readAdminToken(token) {
  const [payload, signature] = String(token || '').split('.');
  if (!payload || !signature || !safeEqual(sign(payload), signature)) return null;
  try {
    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return Number(claims.exp) > Date.now() ? claims : null;
  } catch {
    return null;
  }
}

// Taxmin qilishdan himoya: bitta IP dan 15 daqiqada 10 ta urinish
const attempts = new Map();
const WINDOW = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

/** GET /api/admin/info — kirish ekrani uchun: parol yoqilganmi, bot username (ochiq) */
function info(req, res) {
  res.json({
    passwordEnabled: Boolean(config.admin.password),
    telegramEnabled: hasAdminSource(),
    botUsername: bot.botInfo?.username ?? null,
  });
}

/** POST /api/admin/telegram { initData } — Telegram ichida parolsiz kirish */
async function telegramLogin(req, res) {
  if (isRateLimited(req.ip)) return res.status(429).json({ error: 'TOO_MANY_ATTEMPTS' });
  const data = validateInitData(String(req.body?.initData || ''), config.bot.token, config.auth.initDataMaxAge);
  if (!data?.user?.id) return res.status(401).json({ error: 'INVALID_INIT_DATA' });
  if (!hasAdminSource()) return res.status(403).json({ error: 'NO_ADMIN_CHAT' });
  if (!(await isAdmin(data.user.id))) {
    logger.warn(`Admin panel: ruxsatsiz kirish urinishi — Telegram ID ${data.user.id}`);
    return res.status(403).json({ error: 'NOT_ADMIN' });
  }
  attempts.delete(req.ip);
  return res.json({
    token: createAdminToken({ tg: String(data.user.id) }, TELEGRAM_SESSION_DAYS),
    name: data.user.first_name || null,
  });
}

/** POST /api/admin/login { password } — brauzerdan (ADMIN_PASSWORD berilgan bo'lsa) */
function login(req, res) {
  if (!config.admin.password) return res.status(503).json({ error: 'PASSWORD_DISABLED' });
  if (isRateLimited(req.ip)) return res.status(429).json({ error: 'TOO_MANY_ATTEMPTS' });
  if (!safeEqual(req.body?.password ?? '', config.admin.password)) {
    return res.status(401).json({ error: 'WRONG_PASSWORD' });
  }
  attempts.delete(req.ip);
  return res.json({ token: createAdminToken() });
}

/** Himoyalangan admin so'rovlari uchun middleware */
async function adminAuth(req, res, next) {
  try {
    const [scheme, token] = (req.get('authorization') || '').split(' ');
    const claims = scheme === 'Bearer' ? readAdminToken(token) : null;
    if (!claims) return res.status(401).json({ error: 'UNAUTHORIZED' });
    // Parol bilan berilgan token parol o'chirilsa bekor bo'ladi
    if (!claims.tg && !config.admin.password) return res.status(401).json({ error: 'UNAUTHORIZED' });
    if (claims.tg && !(await isAdmin(claims.tg))) return res.status(401).json({ error: 'UNAUTHORIZED' });
    req.admin = claims;
    return next();
  } catch (error) {
    logger.error('adminAuth xatoligi:', error);
    return res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
}

module.exports = { info, login, telegramLogin, adminAuth, createAdminToken, readAdminToken };
