const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoDbAdapter = require('../utils/mongoDbAdapter');
const router = express.Router();

// Register Patient or Specialist
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phoneNumber, bvn } = req.body;

    console.log("Registration attempt:", { name, email, role });

    // Check if user exists (case-insensitive)
    const users = await mongoDbAdapter.findAll('users');
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (existingUser) {
      console.warn(`[AUTH] Registration failed: email ${email} already exists in DB.`);
      return res.status(400).json({ 
        message: 'This email is already registered. Please try logging in or use a different email.' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await mongoDbAdapter.create('users', {
      name,
      email,
      password: hashedPassword,
      role: role || 'patient',
      phoneNumber,
      bvn,
      isVerified: false
    });

    console.log("User created successfully:", user.id);

    // If specialist, create profile
    if (role === 'specialist') {
      await mongoDbAdapter.create('specialists', {
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

    const user = await mongoDbAdapter.findOne('users', u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      console.warn(`[AUTH] Login failed: User not found for email ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn(`[AUTH] Login failed: Password mismatch for ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

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

// Mock Identity Verification (Interswitch API Marketplace Simulator)
router.post('/verify-identity', async (req, res) => {
  try {
    const { bvn, userId } = req.body;

    const user = await mongoDbAdapter.findById('users', userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // SIMULATED LECTURE REQUIREMENT: Interswitch API Marketplace Bearer Token
    console.log(`INTERSWITCH MARKETPLACE: Authenticating Project for BVN lookup...`);
    const marketplaceToken = `mkt_bearer_${Math.random().toString(36).substr(2)}`;
    console.log(`INTERSWITCH MARKETPLACE: Bearer Token assigned: ${marketplaceToken}`);

    await mongoDbAdapter.update('users', userId, { 
      isVerified: true,
      marketplaceToken: marketplaceToken // Simulating the API link
    });

    res.json({
      success: true,
      message: 'Identity verified successfully with Interswitch BVN API',
      data: {
        firstName: user.name.split(' ')[0],
        status: 'Verified',
        token: marketplaceToken
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Verification failed' });
  }
});

// Reset Password (Demo Flow)
router.post('/reset-password', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user (case-insensitive)
    const user = await mongoDbAdapter.findOne('users', u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Update password
    await mongoDbAdapter.update('users', user.id, { password: hashedPassword });

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Reset failed' });
  }
});

module.exports = router;
