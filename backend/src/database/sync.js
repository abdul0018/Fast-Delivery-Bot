/**
 * Jadval sxemasini bazaga qo'llash: `npm run db:sync`
 * alter: true — mavjud jadvallarni ma'lumotni o'chirmasdan yangilaydi.
 */
const { sequelize, connectDatabase } = require('./connection');
const logger = require('../utils/logger');
require('../models');

/**
 * Production'da sync({ alter: false }) mavjud jadvallarni o'zgartirmaydi — yangi ustun / enum qiymatlarini
 * shu yerda xavfsiz (takror ishlatsa ham zararsiz) qo'shamiz.
 */
const MIGRATIONS = [
  "ALTER TYPE enum_orders_payment_method ADD VALUE IF NOT EXISTS 'card'",
  'ALTER TABLE orders ADD COLUMN IF NOT EXISTS receipt_file_id VARCHAR(255)',
];

async function syncDatabase({ alter = true } = {}) {
  for (const sql of MIGRATIONS) {
    await sequelize.query(sql).catch((error) => {
      // Birinchi ishga tushishda jadval hali yo'q bo'lishi mumkin — sync uni o'zi to'liq yaratadi
      if (!/does not exist/.test(error.message)) logger.warn(`Migratsiya o'tkazib yuborildi: ${error.message}`);
    });
  }
  await sequelize.sync({ alter });
  logger.info('✅ Jadvallar sinxronlandi (users, products, orders, images, settings)');
}

if (require.main === module) {
  connectDatabase()
    .then(() => syncDatabase())
    .then(() => sequelize.close())
    .catch((error) => {
      logger.error('Sinxronlashda xatolik:', error);
      process.exit(1);
    });
}

module.exports = { syncDatabase };
