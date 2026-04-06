const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProductVariant = sequelize.define('ProductVariant', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false, // e.g., "Size", "Color"
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false, // e.g., "Large", "Red"
  },
  sku: {
    type: DataTypes.STRING,
    unique: true,
  },
  priceOverride: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true, // If null, use base product price
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

module.exports = ProductVariant;
