const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  PromotionID: { type: String, required: true, unique: true },
  PromotionName: { type: String, required: true },
  Description: { type: String },
  DiscountType: { type: String, enum: ['percentage', 'fixed_amount', 'FreeItem', 'free_shipping'] },
  DiscountValue: { type: Number, default: 0 },
  MinPurchaseAmount: { type: Number, default: 0 },
  StartDate: { type: Date, required: true },
  EndDate: { type: Date, required: true },
  ApplicableProducts: [{ type: String }],
  ApplicableCategories: [{ type: String }],
  CustomerType: { type: String, enum: ['all', 'vip', 'regular'], default: 'all' },
  MaxUsagePerCustomer: { type: Number, default: 1 },
  TotalUsageLimit: { type: Number },
  IsActive: { type: Boolean, default: true },
  CreatedBy: { type: String },
  CreatedAt: { type: Date, default: Date.now }
}, {
  collection: 'Promotions'
});

module.exports = mongoose.model('Promotion', promotionSchema);