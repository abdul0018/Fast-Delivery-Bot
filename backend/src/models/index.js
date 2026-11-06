/**
 * Modellar va ular orasidagi bog'lanishlar / Модели и связи
 */
const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const Image = require('./Image');
const Setting = require('./Setting');

User.hasMany(Order, { foreignKey: 'userId', as: 'orders', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Order.belongsTo(Product, { foreignKey: 'bumpProductId', as: 'bumpProduct', onDelete: 'SET NULL' });

module.exports = { User, Product, Order, Image, Setting };
