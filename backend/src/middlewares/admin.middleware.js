/**
 * Admin panel (sayt) autentifikatsiyasi / Аутентификация админ-панели
 *
 *  - Parol: ADMIN_PASSWORD (Render → Environment). Bo'sh bo'lsa admin panel o'chiq.
 *  - Kirgandan so'ng imzolangan token beriladi: "<payload>.<hmac>" (Authorization: Bearer <token>).
 *    Imzo kaliti bot tokeni + paroldan hosil qilinadi — parol almashtirilsa barcha eski kirishlar bekor bo'ladi.
 */
const crypto = require('crypto');
const config = require('../config/default');

const DAY = 24 * 60 * 60 * 1000;

const signingKey = () =>
  crypto.createHash('sha256').update(`admin-session:${config.bot.token}:${config.admin.password}`).digest();

const sign = (payload) => crypto.createHmac('sha256', signingKey()).update(payload).digest('base64url');

const safeEqual = (a, b) => {
  const left = crypto.createHash('sha256').update(String(a)).digest();
  const right = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(left, right);
};

function createAdminToken() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + config.admin.sessionDays * DAY })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

function verifyAdminToken(token) {
  const [payload, signature] = String(token || '').split('.');
  if (!payload || !signature || !safeEqual(sign(payload), signature)) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return Number(exp) > Date.now();
  } catch {
    return false;
  }
}

// Parolni taxmin qilishdan himoya: bitta IP dan 15 daqiqada 10 ta urinish
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

/** POST /api/admin/login { password } */
function login(req, res) {
  if (!config.admin.password) return res.status(503).json({ error: 'ADMIN_DISABLED' });
  if (isRateLimited(req.ip)) return res.status(429).json({ error: 'TOO_MANY_ATTEMPTS' });
  if (!safeEqual(req.body?.password ?? '', config.admin.password)) {
    return res.status(401).json({ error: 'WRONG_PASSWORD' });
  }
  attempts.delete(req.ip);
  return res.json({ token: createAdminToken(), expiresInDays: config.admin.sessionDays });
}

/** Himoyalangan admin so'rovlari uchun middleware */
function adminAuth(req, res, next) {
  if (!config.admin.password) return res.status(503).json({ error: 'ADMIN_DISABLED' });
  const [scheme, token] = (req.get('authorization') || '').split(' ');
  if (scheme !== 'Bearer' || !verifyAdminToken(token)) return res.status(401).json({ error: 'UNAUTHORIZED' });
  return next();
}

module.exports = { login, adminAuth, createAdminToken, verifyAdminToken };
