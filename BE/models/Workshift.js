const mongoose = require('mongoose');

const workshiftSchema = new mongoose.Schema({
  ShiftID: { type: String, required: true, unique: true },
  StartAt: { type: Date, required: true },
  EndAt: { type: Date, required: true },
  MaxEmployees: { type: Number, default: 1 },
  Status: { type: String, enum: ['Scheduled', 'InProgress', 'Completed', 'Cancelled'], default: 'Scheduled' },
  Employees: [{
    UserID: String,
    FullName: String,
    Role: String
  }]
}, {
  collection: 'Workshift'
});

module.exports = mongoose.model('Workshift', workshiftSchema);