const express = require('express');
const mongoDbAdapter = require('../utils/mongoDbAdapter');
const { auth, checkRole } = require('../utils/authMiddleware');
const router = express.Router();

// Helper to fetch trust data from ML service
const getTrustData = async (specialist, user) => {
  let trustData = { trust_score: null, trust_label: "Not Yet Rated" };
  try {
    const reviews = (await mongoDbAdapter.findAll("reviews")).filter(async (r) => {
      const appt = await mongoDbAdapter.findById("appointments", r.appointmentId);
      return appt?.specialistId == specialist.id;
    });

    const urls = ["http://127.0.0.1:5001/specialist/rating"];
    for (const url of urls) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); 
        const mlResponse = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            name: user?.name,
            specialisation: specialist.specialization,
            total_consultations: reviews.length,
            ratings: reviews.map((r) => [r.rating, r.createdAt || new Date().toISOString()]),
          }),
        });
        clearTimeout(timeoutId);
        if (mlResponse.ok) {
          trustData = await mlResponse.json();
          break; // Success! Stop trying other URLs
        }
      } catch (e) {
        // Continue to next URL attempt (e.g. from 127.0.0.1 to localhost)
      }
    }
  } catch (err) {
    console.error("Critical error in getTrustData:", err.message);
  }
  return trustData;
};

// Helper to fetch batch trust data from ML service
const getBatchTrustData = async (specialistDataList) => {
  let batchResults = [];
  try {
    const urls = ["http://127.0.0.1:5001/specialist/ratings/batch"];
    for (const url of urls) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); 
        const mlResponse = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({ specialists: specialistDataList }),
        });
        clearTimeout(timeoutId);
        if (mlResponse.ok) {
          const data = await mlResponse.json();
          if (data.success) {
            batchResults = data.results;
            break;
          }
        }
      } catch (e) {
        // Fallback to next URL
      }
    }
  } catch (err) {
    console.error("Batch Trust Data Error:", err.message);
  }
  return batchResults;
};

// Get all specialists with enriched details
router.get("/", async (req, res) => {
  try {
    const specialists = await mongoDbAdapter.findAll("specialists");
    const reviews = await mongoDbAdapter.findAll("reviews");
    const appointments = await mongoDbAdapter.findAll("appointments");

    // Prepare batch data for AI
    const batchInput = await Promise.all(specialists.map(async (s) => {
      const user = await mongoDbAdapter.findById("users", s.userId);
      const sReviews = reviews.filter(r => {
        const appt = appointments.find(a => a.id === r.appointmentId);
        return appt?.specialistId === s.id;
      });
      return {
        id: s.id,
        name: user?.name,
        specialisation: s.specialization,
        total_consultations: sReviews.length,
        ratings: sReviews.map(r => [r.rating, r.createdAt || new Date().toISOString()])
      };
    }));

    const batchResults = await getBatchTrustData(batchInput);

    const enriched = await Promise.all(specialists.map(async (s) => {
      const user = await mongoDbAdapter.findById("users", s.userId);
      const trustData = batchResults.find(r => r.specialistId === s.id) || { trust_score: null, trust_label: "AI Pending" };
      
      return {
        ...s.toObject ? s.toObject() : s,
        user: user ? { name: user.name, email: user.email, isVerified: user.isVerified } : null,
        trust_score: trustData.trust_score,
        trust_label: trustData.trust_label,
      };
    }));
    res.json(enriched);
  } catch (err) {
    console.error("Specialists Route Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get specific specialist with details and available slots
router.get("/:id", async (req, res) => {
  try {
    const specialist = await mongoDbAdapter.findById("specialists", req.params.id);
    if (!specialist) return res.status(404).json({ message: "Specialist not found" });

    const user = await mongoDbAdapter.findById("users", specialist.userId);
    const slots = (await mongoDbAdapter.findAll("slots")).filter((s) => s.specialistId === specialist.id && !s.isBooked);

    const trustData = await getTrustData(specialist, user);

    res.json({
      ...specialist.toObject ? specialist.toObject() : specialist,
      user: { name: user?.name, email: user?.email, phoneNumber: user?.phoneNumber },
      slots,
      trust_score: trustData.trust_score,
      trust_label: trustData.trust_label,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create availability slots (For Specialists)
router.post('/slots', auth, checkRole('specialist'), async (req, res) => {
  try {
    const { startTime, endTime } = req.body;
    const specialist = await mongoDbAdapter.findOne('specialists', s => s.userId === req.user.id);
    if (!specialist) return res.status(404).json({ message: 'Specialist profile not found' });

    const slot = await mongoDbAdapter.create('slots', {
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
    const response = await fetch('http://127.0.0.1:5001/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symptoms })
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Could not reach recommendation service' })
  }
});

module.exports = router;
