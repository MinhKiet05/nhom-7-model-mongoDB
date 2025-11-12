const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
  PriceID: { type: String, required: true, unique: true },
  ProductID: { type: String, required: true },
  UnitID: { type: String },
  Price: { type: Number, default: 0 },
  IsCurrent: { type: Boolean, default: false },
  Start: { type: Date },
  End: { type: Date },
  OtherTax: [{ type: String }],
  Note: { type: String },
  Info: {
    CreateBy: { type: String },
    CreateDate: { type: Date, default: Date.now },
    Status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
  }
}, {
  collection: 'Price'
});

module.exports = mongoose.model('Price', priceSchema);