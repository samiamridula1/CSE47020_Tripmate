// Core Dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/trips', require('./routes/tripRoutes'));
app.use('/api/experiences', require('./routes/experienceRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/suggestions', require('./routes/suggestions'));
app.use('/api/hotels', require('./routes/hotelRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/transport', require('./routes/transportRoutes'));
app.use('/api/locations', require('./routes/locationRoutes'));
app.use('/api/hotel-bookings', require('./routes/hotelBookings'));
app.use('/api/checklists', require('./routes/checklistRoutes'));

// Serve React Frontend
const frontendPath = path.join(__dirname, 'frontend', 'build');
app.use(express.static(frontendPath));

// Catch-all for non-API routes
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));