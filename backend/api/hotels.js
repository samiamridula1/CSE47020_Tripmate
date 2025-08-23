// backend/api/hotels.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json([{ id: 1, name: 'Ocean View' }, { id: 2, name: 'Mountain Escape' }]);
});

router.post('/book', (req, res) => {
  const bookingData = req.body;
  console.log('Booking received:', bookingData);
  res.status(201).json({ message: 'Hotel booked!', booking: bookingData });
});

router.get('/booking/:id', (req, res) => {
  const bookingId = req.params.id;
  res.json({ id: bookingId, hotel: 'Ocean View', guest: 'Samia' });
});

module.exports = router;