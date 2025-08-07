// backend/routes/tripRoutes.js
const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');

// Create trip
router.post('/', async (req, res) => {
  try {
    const trip = new Trip(req.body);
    await trip.save();
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Error creating trip', error });
  }
});

// Get trips by userId
router.get('/user/:userId', async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.params.userId });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trips', error });
  }
});

// Update trip
router.put('/:tripId', async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.tripId, req.body, { new: true });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Error updating trip', error });
  }
});

module.exports = router;
