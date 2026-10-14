/**
 * Jadval sxemasini bazaga qo'llash: `npm run db:sync`
 * alter: true — mavjud jadvallarni ma'lumotni o'chirmasdan yangilaydi.
 */
const { sequelize, connectDatabase } = require('./connection');
const logger = require('../utils/logger');
require('../models');

async function syncDatabase({ alter = true } = {}) {
  await sequelize.sync({ alter });
  logger.info('✅ Jadvallar sinxronlandi (users, products, orders)');
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
