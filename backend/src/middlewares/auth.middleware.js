/**
 * Foydalanuvchini aniqlash va tekshirish / Аутентификация пользователя
 *
 *  - botAuth     — Telegraf middleware: har bir update'da foydalanuvchini bazaga yozadi
 *                   va ctx.t() tarjima funksiyasini qo'shadi.
 *  - webAppAuth  — Express middleware: Mini App yuborgan initData imzosini (HMAC-SHA256)
 *                   bot tokeni bilan tekshiradi. Imzosiz so'rovlar rad etiladi.
 */
const crypto = require('crypto');
const config = require('../config/default');
const { User } = require('../models');
const { t, detectLanguage, DEFAULT_LANGUAGE } = require('../utils/i18n');
const logger = require('../utils/logger');

/** Telegram foydalanuvchisini bazada yaratish yoki ma'lumotlarini yangilash */
async function upsertTelegramUser(tgUser) {
  const profile = {
    firstName: tgUser.first_name || null,
    lastName: tgUser.last_name || null,
    username: tgUser.username || null,
  };

  const [user, created] = await User.findOrCreate({
    where: { telegramId: tgUser.id },
    defaults: { telegramId: tgUser.id, ...profile },
  });

  if (!created) {
    const changed = Object.keys(profile).some((key) => user[key] !== profile[key]);
    if (changed) await user.update(profile);
  }
  return user;
}

/** Foydalanuvchi tili: tanlangan til -> Telegram tili -> o'zbekcha */
const resolveLanguage = (user, languageCode) => user.language || detectLanguage(languageCode) || DEFAULT_LANGUAGE;

// ------------------------------------------------------------------ Bot

async function botAuth(ctx, next) {
  const from = ctx.from;
  if (!from || from.is_bot) return next();

  const user = await upsertTelegramUser(from);
  if (user.isBlocked) return undefined; // bloklangan foydalanuvchiga javob bermaymiz

  ctx.state.user = user;
  ctx.state.lang = resolveLanguage(user, from.language_code);
  ctx.t = (key, params) => t(ctx.state.lang, key, params);
  return next();
}

// ------------------------------------------------------------------ Mini App (initData)

/**
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 * secret_key = HMAC_SHA256("WebAppData", bot_token)
 * hash       = hex(HMAC_SHA256(secret_key, data_check_string))
 */
function validateInitData(initData, botToken, maxAgeSeconds) {
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return null;

  const dataCheckString = [...params.entries()]
    .filter(([key]) => key !== 'hash')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
  const expected = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  const valid =
    expected.length === hash.length && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(hash));
  if (!valid) return null;

  const authDate = Number(params.get('auth_date'));
  if (!authDate || Date.now() / 1000 - authDate > maxAgeSeconds) return null;

  try {
    return { user: JSON.parse(params.get('user') || 'null'), authDate };
  } catch {
    return null;
  }
}

/** Faqat ALLOW_DEV_AUTH=true va production bo'lmaganda: brauzerda test qilish uchun */
const DEV_USER = { id: 1, first_name: 'Dev', last_name: 'User', username: 'dev_user', language_code: 'uz' };

async function webAppAuth(req, res, next) {
  try {
    const header = req.get('authorization') || '';
    const [scheme, initData] = header.split(' ');
    if (scheme !== 'tma' || !initData) {
      return res.status(401).json({ error: 'UNAUTHORIZED' });
    }

    let tgUser;
    if (initData === 'dev' && config.auth.allowDevAuth) {
      tgUser = DEV_USER;
    } else {
      const data = validateInitData(initData, config.bot.token, config.auth.initDataMaxAge);
      if (!data || !data.user) return res.status(401).json({ error: 'INVALID_INIT_DATA' });
      tgUser = data.user;
    }

    const user = await upsertTelegramUser(tgUser);
    if (user.isBlocked) return res.status(403).json({ error: 'BLOCKED' });

    req.user = user;
    req.lang = resolveLanguage(user, tgUser.language_code);
    return next();
  } catch (error) {
    logger.error('webAppAuth xatoligi:', error);
    return res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
}

module.exports = { botAuth, webAppAuth, validateInitData, upsertTelegramUser };
