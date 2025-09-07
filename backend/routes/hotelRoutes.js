const express = require('express');
const {
  getAllHotels,
  createHotelBooking,
  getAllHotelBookings,
  getUserHotelBookings,
} = require('../controllers/hotelController');

const router = express.Router();

// GET: Get all available hotels
router.get('/', getAllHotels);

// POST: Add a hotel booking
router.post('/bookings', createHotelBooking);

// GET: Get all hotel bookings (for activity feed)
router.get('/bookings', getAllHotelBookings);

// GET: Get hotel bookings for a user
router.get('/bookings/:userId', getUserHotelBookings);

module.exports = router;