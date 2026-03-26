const express = require('express');
const jsonDb = require('../utils/jsonDb');
const { auth } = require('../utils/authMiddleware');
const { queryTransactionStatus } = require('../utils/interswitch');
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
      const specUser = jsonDb.findById('users', specialist?.userId);
      const patientUser = jsonDb.findById('users', a.patientId);
      const slot = jsonDb.findById('slots', a.slotId);
      
      return { 
        ...a, 
        specialist: { name: specUser?.name }, 
        patient: { name: patientUser?.name },
        slot 
      };
    });

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 1. Transaction Status Query (Interswitch Requirement)
router.get('/verify-status/:txnRef', auth, (req, res) => {
  try {
    const { txnRef } = req.params;
    const appointment = jsonDb.findOne('appointments', a => a.paymentReference === txnRef);
    
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

    const appointment = jsonDb.findById('appointments', appointmentId);
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
    jsonDb.update('appointments', appointmentId, {
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
