const mongoose = require('mongoose');

const purchaseOrderSchema = new mongoose.Schema({
  POID: { type: String, required: true, unique: true },
  SupplierID: { type: String, required: true },
  Status: { type: String, enum: ['Draft', 'Approved', 'Received', 'Cancelled'], default: 'Draft' },
  OrderDate: { type: Date, required: true },
  Items: [{
    ProductID: { type: String, required: true },
    ProductName: { type: String, required: true },
    OrderedQty: { type: Number, required: true },
    UnitCost: { type: Number, required: true },
    LineDiscount: { type: Number, default: 0 },
    LineTotal: { type: Number, required: true }
  }],
  StatusHistory: [{
    at: { type: Date, required: true },
    from: { type: String, default: null },
    to: { type: String, required: true }
  }],
  CreatedAt: { type: Date, default: Date.now },
  LastUpdatedAt: { type: Date, default: Date.now },
  VAT: { type: Number, default: 0 },
  TotalDiscount: { type: Number, default: 0 },
  TotalPayment: { type: Number, required: true }
}, {
  collection: 'PurchaseOrders'
});

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);