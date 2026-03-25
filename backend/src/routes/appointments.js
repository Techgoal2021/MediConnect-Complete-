const express = require('express');
const jsonDb = require('../utils/jsonDb');
const { auth } = require('../utils/authMiddleware');
const router = express.Router();

// Book an appointment
router.post('/book', auth, (req, res) => {
  try {
    const { specialistId, slotId } = req.body;

    const slot = jsonDb.findById('slots', slotId);
    if (!slot || slot.isBooked) {
      return res.status(400).json({ message: 'Slot is unavailable' });
    }

    const appointment = jsonDb.create('appointments', {
      patientId: req.user.id,
      specialistId,
      slotId,
      status: 'pending',
      paymentStatus: 'unpaid'
    });

    // Mark slot as booked
    jsonDb.update('slots', slotId, { isBooked: true });

    res.status(201).json({
      message: 'Appointment booked successfully. Please proceed to payment.',
      appointmentId: appointment.id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get my appointments (Patient or Specialist)
router.get('/my', auth, (req, res) => {
  try {
    let appointments;
    if (req.user.role === 'patient') {
      appointments = jsonDb.findAll('appointments').filter(a => a.patientId === req.user.id);
    } else {
      const specialist = jsonDb.findOne('specialists', s => s.userId === req.user.id);
      appointments = jsonDb.findAll('appointments').filter(a => a.specialistId === specialist.id);
    }

    // Enrich with data
    const enriched = appointments.map(a => {
      const specialist = jsonDb.findById('specialists', a.specialistId);
      const user = jsonDb.findById('users', specialist?.userId);
      const slot = jsonDb.findById('slots', a.slotId);
      return { ...a, specialist: { name: user?.name }, slot };
    });

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mock Interswitch Payment Verification
router.post('/verify-payment', auth, (req, res) => {
  try {
    const { appointmentId, reference } = req.body;

    const appointment = jsonDb.findById('appointments', appointmentId);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    jsonDb.update('appointments', appointmentId, {
      paymentStatus: 'paid',
      status: 'confirmed',
      paymentReference: reference,
      videoLink: `https://meet.mediconnect.africa/${appointmentId}`
    });

    res.json({
      success: true,
      message: 'Payment verified via Interswitch and appointment confirmed',
      appointmentId
    });
  } catch (err) {
    res.status(500).json({ message: 'Payment verification failed' });
  }
});

module.exports = router;
