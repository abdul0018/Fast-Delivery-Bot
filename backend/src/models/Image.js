/**
 * Admin yuklagan mahsulot rasmlari / Фото товаров, загруженные в админке.
 * Bazada saqlanadi (Render bepul tarifida disk har deploy'da tozalanadi) — /api/images/:id orqali beriladi.
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Image = sequelize.define(
  'Image',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    mimeType: { type: DataTypes.STRING(50), allowNull: false },
    size: { type: DataTypes.INTEGER, allowNull: false },
    data: { type: DataTypes.BLOB, allowNull: false },
  },
  { tableName: 'images', updatedAt: false },
);

/** Mahsulotda saqlanadigan yo'l: frontend uni API domeniga bog'laydi */
Image.pathFor = (id) => `/api/images/${id}`;
/** "/api/images/<uuid>" -> "<uuid>" (bizning rasm bo'lmasa null) */
Image.idFromPath = (path) => {
  const match = /^\/api\/images\/([0-9a-f-]{36})$/i.exec(path || '');
  return match ? match[1] : null;
};

module.exports = Image;
