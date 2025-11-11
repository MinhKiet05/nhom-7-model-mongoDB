const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
  PriceID: { type: String, required: true, unique: true },
  ProductID: { type: String, required: true },
  UnitID: { type: String },
  PriceList: [{
    Price: { type: Number, required: true },
    Start: { type: Date, required: true },
    End: { type: Date },
    OtherTax: { type: String, default: null },
    Note: { type: String }
  }],
  Info: {
    CreateBy: { type: String },
    CreateDate: { type: Date, default: Date.now },
    Status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
  }
}, {
  collection: 'Price'
});

module.exports = mongoose.model('Price', priceSchema);