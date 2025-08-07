// backend/models/Trip.js
const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destination: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  notes: { type: String },
  status: { type: String, enum: ['planned', 'ongoing', 'completed'], default: 'planned' }
});

module.exports = mongoose.model('Trip', tripSchema);
