const { sequelize } = require('../config/database');
const User = require('./User');
const Product = require('./Product');
const Category = require('./Category');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const ProductVariant = require('./ProductVariant');
const Banner = require('./Banner');
const SubCategory = require('./SubCategory');

// Category - SubCategory (One-to-Many)
Category.hasMany(SubCategory, { foreignKey: 'categoryId', as: 'subcategories', onDelete: 'CASCADE' });
SubCategory.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// SubCategory - Product (One-to-Many)
SubCategory.hasMany(Product, { foreignKey: 'subCategoryId', as: 'products', onDelete: 'SET NULL' });
Product.belongsTo(SubCategory, { foreignKey: 'subCategoryId', as: 'subcategory' });

// Category - Product (One-to-Many) - Keeping as secondary for legacy/shortcut
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products', onDelete: 'SET NULL' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Product - ProductVariant (One-to-Many)
Product.hasMany(ProductVariant, { foreignKey: 'productId', as: 'variants', onDelete: 'CASCADE' });
ProductVariant.belongsTo(Product, { foreignKey: 'productId', as: 'product' });


// User - Order (One-to-Many)
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Order - OrderItem (One-to-Many)
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// Product - OrderItem (One-to-Many)
Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

module.exports = {
  sequelize,
  User,
  Product,
  Category,
  Order,
  OrderItem,
  ProductVariant,
  Banner,
  SubCategory,
};
