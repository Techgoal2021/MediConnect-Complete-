const express = require('express');
const jsonDb = require('../utils/jsonDb');
const { auth } = require('../utils/authMiddleware');
const router = express.Router();

// Submit a review
router.post('/', auth, (req, res) => {
  try {
    const { appointmentId, rating, comment } = req.body;

    const appointment = jsonDb.findById('appointments', appointmentId);
    if (!appointment || appointment.patientId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to review this appointment' });
    }

    if (appointment.status !== 'completed' && appointment.status !== 'confirmed') { // Allowing confirmed for hackathon demo
      return res.status(400).json({ message: 'Can only review completed appointments' });
    }

    const review = jsonDb.create('reviews', {
      appointmentId,
      rating,
      comment
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
