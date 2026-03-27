const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  appointmentId: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
