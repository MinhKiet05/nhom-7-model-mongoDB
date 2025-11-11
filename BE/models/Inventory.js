const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  InventoryID: { type: String, required: true, unique: true },
  BranchID: { type: String },
  WarehouseID: { type: String },
  Product: {
    ProductID: String,
    ProductName: String,
    Unit: String
  },
  Quantity: {
    OnHand: { type: Number, default: 0 },
    Reserved: { type: Number, default: 0 },
    Available: { type: Number, default: 0 }
  },
  Cost: {
    UnitCost: { type: Number },
    TotalValue: { type: Number },
    LastUpdated: { type: Date, default: Date.now }
  },
  ReorderPoint: { type: Number },
  Status: { type: String, enum: ['Active', 'Inactive', 'DELETED'], default: 'Active' },
  CreatedAt: { type: Date, default: Date.now },
  UpdatedAt: { type: Date, default: Date.now }
}, {
  collection: 'Inventory'
});

module.exports = mongoose.model('Inventory', inventorySchema);