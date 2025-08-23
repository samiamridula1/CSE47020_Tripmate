const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');

// GET: Get all available hotels
router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (err) {
    console.error('Error fetching hotels:', err);
    res.status(500).json({ error: "Failed to fetch hotels" });
  }
});

// POST: Add a hotel booking
router.post('/bookings', async (req, res) => {
  try {
    const newHotel = new Hotel(req.body);
    const savedHotel = await newHotel.save();
    res.status(201).json(savedHotel);
  } catch (err) {
    console.error('Error saving hotel booking:', err);
    res.status(500).json({ error: "Failed to save hotel booking" });
  }
});

// GET: Get hotel bookings for a user
router.get('/bookings/:userId', async (req, res) => {
  try {
    const hotels = await Hotel.find({ userId: req.params.userId });
    res.status(200).json(hotels);
  } catch (err) {
    console.error('Error fetching hotel bookings:', err);
    res.status(500).json({ error: "Failed to fetch hotel bookings" });
  }
});

module.exports = router;