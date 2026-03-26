const express = require('express');
const router = express.Router();
const { auth } = require('../utils/authMiddleware');
const { generateSHA512Hash, INTERSWITCH_CONFIG } = require('../utils/interswitch');
const jsonDb = require('../utils/jsonDb');

/**
 * POST /api/payments/initiate
 * Generates the necessary Hash and Metadata for Interswitch WebPay
 */
router.post('/initiate', auth, (req, res) => {
    try {
        const { appointmentId, amount } = req.body;
        
        const appointment = jsonDb.findById('appointments', appointmentId);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        // Interswitch Requirement: Amount must be in Kobo
        const amountInKobo = Math.round(parseFloat(amount) * 100);
        
        // Generate a unique Transaction Reference
        const txnRef = `MED-${appointmentId.substr(-4).toUpperCase()}-${Date.now()}`;
        
        // Use the configured Callback URL
        const callbackUrl = process.env.INTERSWITCH_CALLBACK_URL || "http://localhost:5173/appointments";

        // Generate the secure SHA-512 Hash
        const hash = generateSHA512Hash(txnRef, amountInKobo, callbackUrl);

        // Store the reference in the appointment for later verification
        jsonDb.update('appointments', appointmentId, { 
            paymentReference: txnRef,
            amountInKobo: amountInKobo
        });

        res.json({
            merchant_code: INTERSWITCH_CONFIG.MERCHANT_CODE,
            pay_item_id: INTERSWITCH_CONFIG.PAY_ITEM_ID,
            txn_ref: txnRef,
            amount: amountInKobo,
            hash: hash,
            callback_url: callbackUrl,
            currency: "566", // NGN
            site_name: "MediConnect Platform"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to initiate payment' });
    }
});

module.exports = router;
