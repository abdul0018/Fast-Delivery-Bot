/**
 * Kim admin? / Кто админ?
 *  1) ADMIN_IDS — Telegram foydalanuvchi ID lari (ixtiyoriy, vergul bilan)
 *  2) buyurtmalar guruhining (ADMIN_CHAT_ID) a'zolari — guruhga qo'shilgan har kim admin panelga kira oladi
 *  3) ADMIN_CHAT_ID shaxsiy chat bo'lsa — o'sha foydalanuvchining o'zi
 * Guruh a'zoligi Telegram'dan tekshiriladi va 5 daqiqa keshlanadi (guruhdan chiqarilgan odam tezda kirish huquqini yo'qotadi).
 */
const config = require('../config/default');
const bot = require('../core/bot');
const logger = require('./logger');

const CACHE_MS = 5 * 60 * 1000;
const cache = new Map();

async function isGroupMember(chatId, userId) {
  try {
    const member = await bot.telegram.getChatMember(chatId, Number(userId));
    return ['creator', 'administrator', 'member'].includes(member.status) || (member.status === 'restricted' && member.is_member);
  } catch (error) {
    logger.warn(`Admin tekshiruvi (getChatMember) bajarilmadi: ${error.message}`);
    return false;
  }
}

async function isAdmin(telegramId) {
  const id = String(telegramId || '');
  if (!/^\d+$/.test(id)) return false;
  if (config.admin.ids.includes(id)) return true;

  const chat = config.bot.adminChatId ? String(config.bot.adminChatId) : '';
  if (!chat) return false;
  if (chat === id) return true;
  if (!chat.startsWith('-')) return false;

  const hit = cache.get(id);
  if (hit && hit.until > Date.now()) return hit.value;
  const value = await isGroupMember(chat, id);
  cache.set(id, { value, until: Date.now() + CACHE_MS });
  return value;
}

/** Admin panelga kirish yo'li sozlanganmi (aks holda hech kim kira olmaydi) */
const hasAdminSource = () => Boolean(config.admin.ids.length || config.bot.adminChatId);

module.exports = { isAdmin, hasAdminSource };
