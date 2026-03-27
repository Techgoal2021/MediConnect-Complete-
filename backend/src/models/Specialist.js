const mongoose = require('mongoose');

const specialistSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  specialization: { type: String },
  bio: { type: String },
  consultationFee: { type: Number },
  rating: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Specialist', specialistSchema);
