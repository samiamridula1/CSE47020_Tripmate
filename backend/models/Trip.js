const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  destination: String,
  date: Date, // Keep for backward compatibility
  startDate: Date,
  endDate: Date,
  details: String,
  photos: [{ 
    url: String, 
    caption: String, 
    uploadedAt: { type: Date, default: Date.now } 
  }],
  status: { 
    type: String, 
    enum: ['planned', 'in-progress', 'completed', 'cancelled'], 
    default: 'planned' 
  },
  notes: String
}, {
  timestamps: true
});

// Virtual field for trip duration
tripSchema.virtual('duration').get(function() {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  return null;
});

// Ensure virtual fields are serialized
tripSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Trip', tripSchema);