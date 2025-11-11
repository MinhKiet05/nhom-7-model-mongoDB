const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  ProductID: { type: String, required: true, unique: true },
  Barcode: { type: String, unique: true },
  Name: { type: String, required: true },
  Brand: { type: String },
  Category: { type: String },
  Description: { type: String },
  Supplier: { type: String },
  TaxID: [{ type: String }],
  Detail: [{
    k: String,
    v: String
  }],
  ManufactureDate: { type: Date },
  ExpiryDate: { type: Date },
  Unit: [{
    id: String,
    name: String
  }],
  Info: {
    CreateBy: String,
    CreateDate: { type: Date, default: Date.now },
    Status: { type: String, enum: ['Active', 'Inactive', 'DELETED'], default: 'Active' }
  }
}, {
  collection: 'Product'
});

module.exports = mongoose.model('Product', productSchema);