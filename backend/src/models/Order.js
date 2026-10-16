/**
 * Buyurtma / Заказ
 * items — buyurtma paytidagi mahsulotlar nusxasi (snapshot), narx keyin o'zgarsa ham tarix saqlanadi.
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const PAYMENT_METHODS = ['cash', 'payme_click'];
const PAYMENT_STATUSES = ['pending', 'paid', 'failed'];
const STATUSES = ['new', 'confirmed', 'delivering', 'completed', 'cancelled'];

const Order = sequelize.define(
  'Order',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    // [{ productId, nameUz, nameRu, price, quantity }]
    items: { type: DataTypes.JSONB, allowNull: false },
    subtotal: { type: DataTypes.INTEGER, allowNull: false },
    bumpProductId: { type: DataTypes.INTEGER, allowNull: true },
    bumpPrice: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    total: { type: DataTypes.INTEGER, allowNull: false },
    paymentMethod: { type: DataTypes.ENUM(...PAYMENT_METHODS), allowNull: false },
    paymentStatus: { type: DataTypes.ENUM(...PAYMENT_STATUSES), allowNull: false, defaultValue: 'pending' },
    status: { type: DataTypes.ENUM(...STATUSES), allowNull: false, defaultValue: 'new' },
    address: { type: DataTypes.TEXT, allowNull: false },
    phone: { type: DataTypes.STRING(32) },
    comment: { type: DataTypes.TEXT },
    paymentChargeId: { type: DataTypes.STRING },
  },
  {
    tableName: 'orders',
    indexes: [{ fields: ['user_id'] }, { fields: ['status'] }],
  },
);

Order.prototype.toPublicJSON = function toPublicJSON() {
  return {
    id: this.id,
    items: this.items,
    subtotal: this.subtotal,
    bumpPrice: this.bumpPrice,
    total: this.total,
    paymentMethod: this.paymentMethod,
    paymentStatus: this.paymentStatus,
    status: this.status,
    address: this.address,
    createdAt: this.createdAt,
  };
};

Order.PAYMENT_METHODS = PAYMENT_METHODS;
Order.PAYMENT_STATUSES = PAYMENT_STATUSES;
Order.STATUSES = STATUSES;

module.exports = Order;
