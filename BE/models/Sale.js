const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  SaleID: { type: String, required: true, unique: true },
  SaleDate: { type: Date, required: true },
  Customer: {
    CustomerID: String,
    Name: String,
    Phone: String
  },
  User: {
    UserID: String,
    Name: String,
    Role: String
  },
  Items: [{
    ProductID: String,
    Name: String,
    Price: Number,
    Unit: String,
    Quantity: Number,
    DiscountValue: { type: Number, default: 0 },
    LineTotal: Number
  }],
  DiscountTotal: { type: Number, default: 0 },
  VAT: { type: Number, default: 0 },
  GrandTotal: { type: Number, required: true },
  PaymentMethod: { type: String, enum: ['Cash', 'Credit Card', 'Momo', 'Bank Transfer'] },
  Status: { type: String, enum: ['Completed', 'Pending', 'Cancelled'], default: 'Completed' },
  Notes: { type: String }
}, {
  collection: 'Sales'
});

module.exports = mongoose.model('Sale', saleSchema);