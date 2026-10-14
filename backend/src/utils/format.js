/** Formatlash yordamchilari / Помощники форматирования */

/** 25000 -> "25 000" */
const formatPrice = (amount) =>
  String(Math.round(Number(amount) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

/** Telegram HTML parse_mode uchun xavfsiz matn */
const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

module.exports = { formatPrice, escapeHtml };
