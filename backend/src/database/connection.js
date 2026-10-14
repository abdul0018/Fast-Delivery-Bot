/**
 * PostgreSQL ulanishi (Sequelize ORM).
 * Neon serverless Postgres uchun SSL majburiy, lokal bazada esa SSL o'chiriladi.
 */
const { Sequelize } = require('sequelize');
const config = require('../config/default');
const logger = require('../utils/logger');

const needsSsl = /sslmode=(require|verify-full|verify-ca)/.test(config.db.url);

const sequelize = new Sequelize(config.db.url, {
  dialect: 'postgres',
  logging: config.db.logging ? (sql) => logger.debug(sql) : false,
  dialectOptions: needsSsl ? { ssl: { require: true, rejectUnauthorized: true } } : {},
  pool: { max: 5, min: 0, idle: 10000, acquire: 30000 },
  define: {
    underscored: true, // jadval ustunlari: created_at, telegram_id ...
    timestamps: true,
  },
});

async function connectDatabase() {
  await sequelize.authenticate();
  logger.info('✅ PostgreSQL ga ulanildi');
}

module.exports = { sequelize, connectDatabase };
