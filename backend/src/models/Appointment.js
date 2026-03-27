const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  patientId: { type: String, required: true },
  specialistId: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  paymentStatus: { type: String, default: 'pending' },
  paymentReference: { type: String },
  amountInKobo: { type: Number, default: 500000 },
  patientName: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
