const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  destination: String,
  date: Date,
  details: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Trip', tripSchema);