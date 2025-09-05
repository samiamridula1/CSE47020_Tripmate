const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');

// Get all trips (for activity feed)
router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find().sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    console.error('Error fetching all trips:', error);
    res.status(500).json({ message: 'Error fetching trips', error: error.message });
  }
});

// Get trips by user
router.get('/:userId', async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.params.userId });
    res.json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ message: 'Error fetching trips', error: error.message });
  }
});

// Add new trip
router.post('/', async (req, res) => {
  try {
    const trip = new Trip(req.body);
    await trip.save();
    res.status(201).json(trip);
  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({ message: 'Error creating trip', error: error.message });
  }
});

// Update trip
router.put('/:id', async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json(trip);
  } catch (error) {
    console.error('Error updating trip:', error);
    res.status(500).json({ message: 'Error updating trip', error: error.message });
  }
});

// Delete trip
router.delete('/:id', async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ message: 'Error deleting trip', error: error.message });
  }
});

// Add photo to trip
router.post('/:id/photos', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    
    trip.photos.push(req.body);
    await trip.save();
    res.json(trip);
  } catch (error) {
    console.error('Error adding photo to trip:', error);
    res.status(500).json({ message: 'Error adding photo', error: error.message });
  }
});

// Remove photo from trip
router.delete('/:id/photos/:photoIndex', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    
    const photoIndex = parseInt(req.params.photoIndex);
    if (photoIndex < 0 || photoIndex >= trip.photos.length) {
      return res.status(400).json({ message: 'Invalid photo index' });
    }
    
    trip.photos.splice(photoIndex, 1);
    await trip.save();
    res.json(trip);
  } catch (error) {
    console.error('Error removing photo from trip:', error);
    res.status(500).json({ message: 'Error removing photo', error: error.message });
  }
});

// Update trip status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['planned', 'in-progress', 'completed', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const trip = await Trip.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    
    res.json(trip);
  } catch (error) {
    console.error('Error updating trip status:', error);
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
});

module.exports = router;