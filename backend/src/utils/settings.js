/**
 * Sozlamalar keshi: ishga tushganda bazadan o'qiladi, admin o'zgartirganda yangilanadi.
 * Sinxron o'qish (getCard) — buyurtma va /api/config tez ishlashi uchun.
 */
const { Setting } = require('../models');
const logger = require('./logger');

const KEYS = ['cardNumber', 'cardHolder', 'cardBank'];
const cache = { cardNumber: '', cardHolder: '', cardBank: '' };

async function loadSettings() {
  try {
    const rows = await Setting.findAll({ where: { key: KEYS } });
    for (const row of rows) cache[row.key] = row.value || '';
  } catch (error) {
    logger.warn('Sozlamalar o\'qilmadi:', error.message);
  }
  return { ...cache };
}

/** Faqat ruxsat etilgan kalitlar saqlanadi */
async function saveSettings(patch) {
  for (const key of KEYS) {
    if (patch[key] === undefined) continue;
    const value = String(patch[key] ?? '').trim();
    await Setting.upsert({ key, value });
    cache[key] = value;
  }
  return { ...cache };
}

const getSettings = () => ({ ...cache });

/** "8600123412341234" -> "8600 1234 1234 1234" */
const formatCardNumber = (digits) => String(digits || '').replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');

/** To'lov kartasi (raqam saqlangan bo'lsa), aks holda null — "Kartaga o'tkazma" usuli yashirin */
function getCard() {
  if (!cache.cardNumber) return null;
  return { number: formatCardNumber(cache.cardNumber), holder: cache.cardHolder || '', bank: cache.cardBank || '' };
}

module.exports = { loadSettings, saveSettings, getSettings, getCard, formatCardNumber, KEYS };
