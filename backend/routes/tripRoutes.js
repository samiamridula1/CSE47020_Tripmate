const express = require('express');
const router = express.Router();
const {
  getAllTrips,
  getUserTrips,
  createTrip,
  updateTrip,
  deleteTrip,
  addTripPhoto,
  removeTripPhoto,
  updateTripStatus,
} = require('../controllers/tripControllers');

// Get all trips (for activity feed)
router.get('/', getAllTrips);

// Get trips by user
router.get('/:userId', getUserTrips);

// Add new trip
router.post('/', createTrip);

// Update trip
router.put('/:id', updateTrip);

// Delete trip
router.delete('/:id', deleteTrip);

// Add photo to trip
router.post('/:id/photos', addTripPhoto);

// Remove photo from trip
router.delete('/:id/photos/:photoIndex', removeTripPhoto);

// Update trip status
router.patch('/:id/status', updateTripStatus);

module.exports = router;