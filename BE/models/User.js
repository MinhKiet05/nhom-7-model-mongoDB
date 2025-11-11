const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  UserID: { type: String, required: true, unique: true },
  FullName: { type: String, required: true },
  Account: {
    Username: { type: String, required: true, unique: true },
    Password: { type: String, required: true }
  },
  Roles: [{ type: String, enum: ['Admin', 'Manager', 'Cashier', 'Stocker'] }],
  Phone: { type: String },
  Status: { type: String, enum: ['Active', 'Inactive', 'Resigned'], default: 'Active' }
}, {
  collection: 'Users'
});

module.exports = mongoose.model('User', userSchema);