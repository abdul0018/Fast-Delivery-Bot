/**
 * Do'kon sozlamalari (kalit → qiymat), admin panelda tahrirlanadi / Настройки магазина
 * Hozir: to'lov kartasi (raqam, egasi, bank).
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Setting = sequelize.define(
  'Setting',
  {
    key: { type: DataTypes.STRING(100), primaryKey: true },
    value: { type: DataTypes.TEXT, allowNull: true },
  },
  { tableName: 'settings' },
);

module.exports = Setting;
