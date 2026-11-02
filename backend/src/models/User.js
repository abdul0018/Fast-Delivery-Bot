/**
 * Foydalanuvchi (Telegram akkaunti) / Пользователь
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const User = sequelize.define(
  'User',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    telegramId: { type: DataTypes.BIGINT, allowNull: false, unique: true },
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    username: { type: DataTypes.STRING },
    // null — foydalanuvchi hali tilni tanlamagan (bot /start da so'raydi)
    language: { type: DataTypes.ENUM('uz', 'ru'), allowNull: true },
    phone: { type: DataTypes.STRING(32) },
    address: { type: DataTypes.TEXT },
    // Oxirgi tanlangan yetkazish nuqtasi (xaritadan yoki geolokatsiyadan)
    latitude: { type: DataTypes.DOUBLE, allowNull: true },
    longitude: { type: DataTypes.DOUBLE, allowNull: true },
    isBlocked: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  { tableName: 'users' },
);

/** Mini App uchun xavfsiz ko'rinish */
User.prototype.toPublicJSON = function toPublicJSON() {
  return {
    id: this.id,
    telegramId: String(this.telegramId),
    firstName: this.firstName,
    lastName: this.lastName,
    username: this.username,
    language: this.language,
    phone: this.phone,
    address: this.address,
    latitude: this.latitude,
    longitude: this.longitude,
  };
};

module.exports = User;
