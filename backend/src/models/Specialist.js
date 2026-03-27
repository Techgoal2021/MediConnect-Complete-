const mongoose = require('mongoose');

const specialistSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  specialisation: { type: String, required: true },
  total_consultations: { type: Number, default: 0 },
  ratings: [{
    stars: { type: Number, required: true },
    date: { type: String, required: true }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Specialist', specialistSchema);
