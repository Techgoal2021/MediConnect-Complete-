const express = require('express');
const mongoDbAdapter = require('../utils/mongoDbAdapter');
const { auth } = require('../utils/authMiddleware');
const { queryTransactionStatus } = require('../utils/interswitch');
const router = express.Router();

// Book an appointment
router.post('/book', auth, async (req, res) => {
  try {
    const { specialistId, slotId } = req.body;
    const slot = await mongoDbAdapter.findById('slots', slotId);
    if (!slot || slot.isBooked) {
      return res.status(400).json({ message: 'Slot is unavailable' });
    }
    const appointment = await mongoDbAdapter.create('appointments', {
      patientId: req.user.id,
      specialistId,
      slotId,
      status: 'pending',
      paymentStatus: 'unpaid'
    });
    // Mark slot as booked
    await mongoDbAdapter.update('slots', slotId, { isBooked: true });
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
router.get('/my', auth, async (req, res) => {
  try {
    let appointments;
    if (req.user.role === 'patient') {
      appointments = (await mongoDbAdapter.findAll('appointments')).filter(a => a.patientId === req.user.id);
    } else {
      // Find specialist profile linked to this user (may not exist for newly registered specialists)
      const specialist = await mongoDbAdapter.findOne('specialists', { userId: req.user.id });
      if (!specialist) {
        return res.json([]); // No specialist profile yet — return empty appointments
      }
      appointments = (await mongoDbAdapter.findAll('appointments')).filter(a => a.specialistId === specialist.id);
    }

    // Enrich with data (Async map)
    const enriched = await Promise.all(appointments.map(async (a) => {
      const specialist = await mongoDbAdapter.findById('specialists', a.specialistId);
      const specUser = await mongoDbAdapter.findById('users', specialist?.userId);
      const patientUser = await mongoDbAdapter.findById('users', a.patientId);
      const slot = await mongoDbAdapter.findById('slots', a.slotId);
      
      return { 
        ...a.toObject ? a.toObject() : a, 
        specialist: { name: specUser?.name }, 
        patient: { name: patientUser?.name },
        slot 
      };
    }));

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 1. Transaction Status Query (Interswitch Requirement)
router.get('/verify-status/:txnRef', auth, async (req, res) => {
  try {
    const { txnRef } = req.params;
    const appointment = await mongoDbAdapter.findOne('appointments', a => a.paymentReference === txnRef);
    
    if (!appointment) return res.status(404).json({ message: 'Transaction reference not found' });
    
    // SECURITY: Ensure user only accesses their own transaction data
    if (appointment.patientId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: You can only query your own transactions' });
    }
    
    res.json({
      status: appointment.paymentStatus === 'paid' ? 'SUCCESS' : 'PENDING',
      amount: 500000, // Amount in Kobo
      transactionDate: appointment.updatedAt || appointment.createdAt,
      merchantReference: txnRef
    });
  } catch (err) {
    res.status(500).json({ message: 'Status query failed' });
  }
});

// 2. Interswitch Payment Verification (Production Ready via Inquiry API)
router.post('/verify-payment', auth, async (req, res) => {
  try {
    const { appointmentId, reference } = req.body;
    const appointment = await mongoDbAdapter.findById('appointments', appointmentId);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // SECURITY: Ensure user is the owner of the appointment being verified
    if (appointment.patientId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied: Unauthorized payment verification' });
    }

    // 1. Query the Interswitch Transaction Status API
    console.log(`INTERSWITCH INQUIRY: Verifying transaction ${reference}...`);
    const verification = await queryTransactionStatus(reference, appointment.amountInKobo || 500000);

    if (verification.status !== "SUCCESS") {
        return res.status(400).json({ 
            message: 'Transaction verification failed at Interswitch',
            details: verification.rawData
        });
    }

    // 2. Update the database on success
    await mongoDbAdapter.update('appointments', appointmentId, {
      paymentStatus: 'paid',
      status: 'confirmed',
      paymentReference: reference,
      verificationSource: 'Interswitch Inquiry API',
      videoLink: `https://meet.mediconnect.africa/${appointmentId}`
    });

    res.json({
      success: true,
      message: 'Payment verified via Interswitch and appointment confirmed',
      appointmentId,
      reference
    });
  } catch (err) {
    console.error("Payment verification error:", err);
    res.status(500).json({ message: err.message || 'Payment verification failed' });
  }
});

module.exports = router;
