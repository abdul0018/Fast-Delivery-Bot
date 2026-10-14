/**
 * Mahsulot (ikki tilli nom va tarkib) / Товар (двуязычный)
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const CATEGORIES = ['burgers', 'pizza', 'drinks', 'premium'];

const Product = sequelize.define(
  'Product',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    slug: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    category: { type: DataTypes.ENUM(...CATEGORIES), allowNull: false },
    nameUz: { type: DataTypes.STRING, allowNull: false },
    nameRu: { type: DataTypes.STRING, allowNull: false },
    descriptionUz: { type: DataTypes.TEXT },
    descriptionRu: { type: DataTypes.TEXT },
    ingredientsUz: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    ingredientsRu: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    price: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 0 } },
    oldPrice: { type: DataTypes.INTEGER, allowNull: true, validate: { min: 0 } },
    image: { type: DataTypes.STRING(500) },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    // Savatchadagi "Order Bump" taklifi uchun ishlatiladigan mahsulot (masalan, Kola)
    isUpsell: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  {
    tableName: 'products',
    indexes: [{ fields: ['category', 'is_active'] }],
  },
);

/** Frontend uchun: tarjimalar { uz, ru } ko'rinishida guruhlanadi */
Product.prototype.toPublicJSON = function toPublicJSON() {
  return {
    id: this.id,
    slug: this.slug,
    category: this.category,
    name: { uz: this.nameUz, ru: this.nameRu },
    description: { uz: this.descriptionUz || '', ru: this.descriptionRu || '' },
    ingredients: { uz: this.ingredientsUz || [], ru: this.ingredientsRu || [] },
    price: this.price,
    oldPrice: this.oldPrice,
    image: this.image,
    isUpsell: this.isUpsell,
  };
};

Product.CATEGORIES = CATEGORIES;

module.exports = Product;
