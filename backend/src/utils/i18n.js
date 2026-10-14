/**
 * Lokalizatsiya (O'zbek / Rus).
 * Barcha matnlar src/locales/*.json fayllarida saqlanadi.
 *
 *   t('ru', 'order.created', { id: 15 })  ->  "Заказ #15 принят"
 */
const uz = require('../locales/uz.json');
const ru = require('../locales/ru.json');

const dictionaries = { uz, ru };
const SUPPORTED_LANGUAGES = Object.keys(dictionaries);
const DEFAULT_LANGUAGE = 'uz';

/** Nuqta bilan yozilgan kalit bo'yicha qiymat olish: "menu.orders" */
const resolve = (dict, key) =>
  key.split('.').reduce((node, part) => (node == null ? undefined : node[part]), dict);

/** "{name}" ko'rinishidagi o'rinbosarlarni almashtirish */
const interpolate = (text, params = {}) =>
  text.replace(/\{(\w+)\}/g, (match, name) => (params[name] !== undefined ? String(params[name]) : match));

const normalizeLanguage = (lang) => (SUPPORTED_LANGUAGES.includes(lang) ? lang : DEFAULT_LANGUAGE);

function t(lang, key, params) {
  const value = resolve(dictionaries[normalizeLanguage(lang)], key) ?? resolve(dictionaries[DEFAULT_LANGUAGE], key);
  if (typeof value !== 'string') return key;
  return interpolate(value, params);
}

/** Bir kalitning barcha tillardagi qiymatlari (hears() uchun foydali) */
const allTranslations = (key) => SUPPORTED_LANGUAGES.map((lang) => t(lang, key));

/** Telegram language_code dan mos tilni aniqlash */
const detectLanguage = (languageCode) => (languageCode && languageCode.startsWith('ru') ? 'ru' : null);

module.exports = { t, allTranslations, normalizeLanguage, detectLanguage, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE };
