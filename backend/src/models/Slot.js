const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  specialistId: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String },
  isBooked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Slot', slotSchema);
