const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  CustomerID: { type: String, required: true, unique: true },
  FullName: { type: String, required: true },
  Gender: { type: String, enum: ['Nam', 'Nữ'] },
  BirthDate: { type: Date },
  Phone: { type: String },
  Email: { type: String },
  Address: {
    Street: String,
    District: String,
    City: String,
    Country: String
  },
  MembershipType: { type: String, enum: ['Bronze', 'Silver', 'Gold', 'Platinum'] },
  Points: { type: Number, default: 0 },
  JoinDate: { type: Date, default: Date.now },
  TotalSpent: { type: Number, default: 0 },
  Status: { type: String, enum: ['Active', 'Inactive', 'Suspended', 'Deleted'], default: 'Active' },
  CreatedBy: { type: String },
  CreatedAt: { type: Date, default: Date.now }
}, {
  collection: 'Customers'
});

module.exports = mongoose.model('Customer', customerSchema);