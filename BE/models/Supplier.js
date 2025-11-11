const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  SupplierID: { type: String, required: true, unique: true },
  Name: { type: String, required: true },
  TaxCode: { type: String, unique: true },
  Address: {
    Street: String,
    District: String,
    City: String,
    Country: String
  },
  Phone: { type: String },
  Email: { type: String },
  PaymentTerms: {
    Type: { type: String, enum: ['NET30', 'NET15', 'NET7', 'COD'] },
    CreditLimit: { type: Number, default: 0 }
  },
  Status: { type: String, enum: ['Active', 'Inactive', 'TemporarilyHold'], default: 'Active' },
  CreatedAt: { type: Date, default: Date.now },
  LastUpdatedAt: { type: Date, default: Date.now }
}, {
  collection: 'SuppliersFinal'
});

module.exports = mongoose.model('Supplier', supplierSchema);