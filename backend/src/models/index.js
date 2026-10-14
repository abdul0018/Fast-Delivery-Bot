/**
 * Modellar va ular orasidagi bog'lanishlar / Модели и связи
 */
const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');

User.hasMany(Order, { foreignKey: 'userId', as: 'orders', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Order.belongsTo(Product, { foreignKey: 'bumpProductId', as: 'bumpProduct', onDelete: 'SET NULL' });

module.exports = { User, Product, Order };
