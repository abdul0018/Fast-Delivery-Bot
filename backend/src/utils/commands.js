/**
 * Bot komandalari menyusi (Telegram "/" tugmasi) / Меню команд бота
 */
const config = require('../config/default');
const logger = require('./logger');

const COMMANDS = {
  ru: [
    { command: 'start', description: 'Запустить бота' },
    { command: 'menu', description: 'Открыть каталог' },
    { command: 'orders', description: 'Мои заказы' },
    { command: 'lang', description: 'Сменить язык' },
  ],
  uz: [
    { command: 'start', description: 'Botni ishga tushirish' },
    { command: 'menu', description: 'Katalogni ochish' },
    { command: 'orders', description: 'Buyurtmalarim' },
    { command: 'lang', description: "Tilni o'zgartirish" },
  ],
};

const ADMIN_COMMAND = { ru: 'Админ-панель', uz: 'Admin panel' };

/** Do'kon egasi / admin menyusida qo'shimcha /admin (boshqa foydalanuvchilarga ko'rinmaydi) */
async function setAdminCommands(telegram, chatId, lang = 'ru') {
  const key = lang === 'uz' ? 'uz' : 'ru';
  try {
    await telegram.setMyCommands([...COMMANDS[key], { command: 'admin', description: ADMIN_COMMAND[key] }], {
      scope: { type: 'chat', chat_id: Number(chatId) },
    });
  } catch (error) {
    // Foydalanuvchi botga hali /start yubormagan bo'lsa — keyinroq /start da qayta o'rnatiladi
    logger.warn(`/admin komandasi ${chatId} uchun o'rnatilmadi: ${error.message}`);
  }
}

/** Ishga tushganda: umumiy menyu (ru standart, uz) va adminlar uchun /admin */
async function setupCommands(telegram) {
  await telegram.setMyCommands(COMMANDS.ru);
  await telegram.setMyCommands(COMMANDS.uz, { language_code: 'uz' });
  for (const id of config.admin.ids) await setAdminCommands(telegram, id);
}

module.exports = { COMMANDS, setupCommands, setAdminCommands };
