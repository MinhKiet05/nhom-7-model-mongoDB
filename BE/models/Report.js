const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  ReportID: { type: String, required: true, unique: true },
  Type: { type: String, enum: ['Sales', 'Finance', 'Inventory'], required: true },
  Period: {
    StartDate: { type: Date, required: true },
    EndDate: { type: Date, required: true }
  },
  BranchID: { type: String },
  Metrics: {
    TotalSales: Number,
    TotalProfit: Number,
    TotalOrders: Number,
    TotalCustomers: Number,
    StockValue: Number,
    TopProducts: [{
      ProductID: String,
      ProductName: String,
      QuantitySold: Number,
      Revenue: Number
    }]
  },
  GeneratedBy: { type: String },
  GeneratedAt: { type: Date, default: Date.now },
  Notes: { type: String }
}, {
  collection: 'Reports'
});

module.exports = mongoose.model('Report', reportSchema);