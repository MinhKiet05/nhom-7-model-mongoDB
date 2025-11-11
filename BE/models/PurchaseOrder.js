const mongoose = require('mongoose');

const purchaseOrderSchema = new mongoose.Schema({
  POID: { type: String, required: true, unique: true },
  SupplierID: { type: String, required: true },
  Status: { type: String, enum: ['Draft', 'Approved', 'Received', 'Cancelled'], default: 'Draft' },
  OrderDate: { type: Date, required: true },
  Items: [{
    LineNo: Number,
    ProductID: String,
    ProductName: String,
    OrderedQty: Number,
    UnitCost: Number
  }],
  Totals: {
    Subtotal: Number,
    VAT: Number,
    GrandTotal: Number
  },
  StatusHistory: [{
    at: Date,
    by: String,
    from: String,
    to: String,
    note: String
  }],
  CreatedAt: { type: Date, default: Date.now },
  LastUpdatedAt: { type: Date, default: Date.now }
}, {
  collection: 'PurchaseOrders'
});

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);