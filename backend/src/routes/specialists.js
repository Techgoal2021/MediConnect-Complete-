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

    const baseUrl = process.env.ML_SERVICE_URL || "http://127.0.0.1:5001";
    const targetUrl = baseUrl.endsWith('/specialist/rating') ? baseUrl : `${baseUrl.replace(/\/$/, '')}/specialist/rating`;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); 
      const mlResponse = await fetch(targetUrl, {
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
      }
    } catch (e) {
      console.warn("AI Engine unreachable for single specialist rating.");
    }
  } catch (err) {
    console.error("Critical error in getTrustData:", err.message);
  }
  return trustData;
};

// Simple in-memory cache for batch trust results (1 minute TTL)
let batchCache = { data: null, timestamp: 0 };
const CACHE_TTL = 60000;

const getBatchTrustData = async (specialistDataList) => {
  const now = Date.now();
  if (batchCache.data && (now - batchCache.timestamp < CACHE_TTL)) {
    return batchCache.data;
  }

  let batchResults = [];
  try {
    const baseUrl = (process.env.ML_SERVICE_URL || "http://127.0.0.1:5001").replace(/\/$/, '');
    const targetUrl = `${baseUrl}/specialist/ratings/batch`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500); // Tighter timeout

    const mlResponse = await fetch(targetUrl, {
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
        batchCache = { data: batchResults, timestamp: now }; // Update cache
      }
    }
  } catch (e) {
    console.warn("AI Engine unreachable or timed out for batch ratings.");
  }
  return batchResults;
};

// Get all specialists with enriched details
router.get("/", async (req, res) => {
  try {
    const [specialists, reviews, appointments, users] = await Promise.all([
      mongoDbAdapter.findAll("specialists"),
      mongoDbAdapter.findAll("reviews"),
      mongoDbAdapter.findAll("appointments"),
      mongoDbAdapter.findAll("users")
    ]);

    // 1. Pre-map users by ID for O(1) lookup
    const userMap = users.reduce((acc, u) => ({ ...acc, [u.id]: u }), {});

    // 2. Pre-map reviews by Specialist ID for O(1) lookup
    // First, link reviews to their specialistId through appointments
    const reviewsBySpecialist = {};
    const apptMap = appointments.reduce((acc, a) => ({ ...acc, [a.id]: a }), {});
    
    reviews.forEach(r => {
      const appt = apptMap[r.appointmentId];
      if (appt && appt.specialistId) {
        if (!reviewsBySpecialist[appt.specialistId]) reviewsBySpecialist[appt.specialistId] = [];
        reviewsBySpecialist[appt.specialistId].push(r);
      }
    });

    // 3. Prepare batch input for AI
    const batchInput = specialists.map(s => {
      const user = userMap[s.userId];
      const sReviews = reviewsBySpecialist[s.id] || [];
      return {
        id: s.id,
        name: user?.name,
        specialisation: s.specialization,
        total_consultations: sReviews.length,
        ratings: sReviews.map(r => [r.rating, r.createdAt || new Date().toISOString()])
      };
    });

    // 4. Get batch AI scores (Cached)
    const batchResults = await getBatchTrustData(batchInput);
    const aiResultMap = batchResults.reduce((acc, r) => ({ ...acc, [r.specialistId]: r }), {});

    // 5. Final Enrichment
    const enriched = specialists.map(s => {
      const user = userMap[s.userId];
      const trustData = aiResultMap[s.id];
      const sReviews = reviewsBySpecialist[s.id] || [];
      
      const avgRating = sReviews.length > 0 
        ? (sReviews.reduce((acc, r) => acc + r.rating, 0) / sReviews.length).toFixed(1)
        : "5.0";
      
      const fallbackLabel = parseFloat(avgRating) >= 4.5 ? "Top Rated" : "Verified Specialist";

      return {
        ...s.toObject ? s.toObject() : s,
        user: user ? { name: user.name, email: user.email, isVerified: user.isVerified } : null,
        trust_score: (trustData && trustData.trust_score !== null) ? trustData.trust_score : (parseFloat(avgRating) * 20).toFixed(0),
        trust_label: (trustData && trustData.trust_label && trustData.trust_label !== "Not Rated") ? trustData.trust_label : fallbackLabel,
        rating: avgRating
      };
    });

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
    const baseUrl = process.env.ML_SERVICE_URL || "http://127.0.0.1:5001";
    const targetUrl = baseUrl.endsWith('/recommend') ? baseUrl : `${baseUrl.replace(/\/$/, '')}/recommend`;

    const response = await fetch(targetUrl, {
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
