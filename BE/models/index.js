// Export all models for easy importing
const Customer = require('./Customer');
const Product = require('./Product');
const Inventory = require('./Inventory');
const Supplier = require('./Supplier');
const User = require('./User');
const Promotion = require('./Promotion');
const Tax = require('./Tax');
const Price = require('./Price');
const Sale = require('./Sale');
const Return = require('./Return');
const PurchaseOrder = require('./PurchaseOrder');
const Report = require('./Report');
const Workshift = require('./Workshift');

module.exports = {
  Customer,
  Product,
  Inventory,
  Supplier,
  User,
  Promotion,
  Tax,
  Price,
  Sale,
  Return,
  PurchaseOrder,
  Report,
  Workshift
};