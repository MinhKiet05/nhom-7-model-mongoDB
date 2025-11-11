const mongoose = require('mongoose');

const taxSchema = new mongoose.Schema({
  taxCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  percent: { type: Number, required: true },
  start: { type: Date, required: true },
  end: { type: Date, default: null },
  descriptions: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, {
  collection: 'Tax'
});

module.exports = mongoose.model('Tax', taxSchema);