const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
  ReturnID: { type: String, required: true, unique: true },
  ReturnDate: { type: Date, required: true },
  Sale: {
    SaleID: String,
    SaleDate: Date,
    GrandTotal: Number
  },
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
    Reason: String,
    RefundAmount: Number
  }],
  TotalRefund: { type: Number, required: true },
  ReturnType: { type: String, enum: ['Refund', 'Exchange'], default: 'Refund' },
  Status: { type: String, enum: ['Completed', 'Pending', 'Cancelled'], default: 'Completed' },
  Notes: { type: String }
}, {
  collection: 'Returns'
});

module.exports = mongoose.model('Return', returnSchema);