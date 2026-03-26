const express = require('express');
const jsonDb = require('../utils/jsonDb');
const { auth, checkRole } = require('../utils/authMiddleware');
const router = express.Router();

// Get all specialists with their user details
router.get('/', (req, res) => {
  try {
    const specialists = jsonDb.findAll('specialists');
    const users = jsonDb.findAll('users');

    const result = specialists.map(s => {
      const user = users.find(u => u.id === s.userId);
      return { ...s, user: { name: user?.name, email: user?.email, isVerified: user?.isVerified } };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific specialist with details and available slots
router.get('/:id', (req, res) => {
  try {
    const specialist = jsonDb.findById('specialists', req.params.id);
    if (!specialist) return res.status(404).json({ message: 'Specialist not found' });

    const user = jsonDb.findById('users', specialist.userId);
    const slots = jsonDb.findAll('slots').filter(s => s.specialistId === specialist.id && !s.isBooked);

    res.json({
      ...specialist,
      user: { name: user?.name, email: user?.email, phoneNumber: user?.phoneNumber },
      slots
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create availability slots (For Specialists)
router.post('/slots', auth, checkRole('specialist'), (req, res) => {
  try {
    const { startTime, endTime } = req.body;
    const specialist = jsonDb.findOne('specialists', s => s.userId === req.user.id);
    if (!specialist) return res.status(404).json({ message: 'Specialist profile not found' });

    const slot = jsonDb.create('slots', {
      specialistId: specialist.id,
      startTime,
      endTime,
      isBooked: false
    });

    res.status(201).json(slot);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Recommend a specislist based on symptoms
router.post('/recommend', async (req, res) => {
  try {
    const { symptoms } = req.body;
    const response = await fetch('https://127.0.0.1:5000/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symptoms })
    });
    const data = await response.json();
  } catch (err) {
    res.status(500).json({ message: 'Could not reach recommendation service' })
  }
});

module.exports = router;
