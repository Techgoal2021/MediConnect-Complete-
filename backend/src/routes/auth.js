const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jsonDb = require('../utils/jsonDb');
const router = express.Router();

// Register Patient or Specialist
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phoneNumber, bvn } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user exists
    const users = jsonDb.findAll('users');
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = jsonDb.create('users', {
      name,
      email,
      password: hashedPassword,
      role: role || 'patient',
      phoneNumber,
      bvn,
      isVerified: false
    });

    // If specialist, create profile
    if (role === 'specialist') {
      jsonDb.create('specialists', {
        userId: user.id,
        specialization: '',
        bio: '',
        rating: 0,
        consultationFee: 5000
      });
    }

    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = jsonDb.findOne('users', u => u.email === email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mock Identity Verification (Interswitch API Simulator)
router.post('/verify-identity', async (req, res) => {
  try {
    const { bvn, userId } = req.body;

    const user = jsonDb.findById('users', userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    jsonDb.update('users', userId, { isVerified: true });

    res.json({
      success: true,
      message: 'Identity verified successfully with Interswitch BVN API',
      data: {
        firstName: user.name.split(' ')[0],
        status: 'Verified'
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Verification failed' });
  }
});

module.exports = router;
