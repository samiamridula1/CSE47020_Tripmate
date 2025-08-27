const mongoose = require("mongoose");

const transportProviderSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["flight", "train", "bus", "car"],
    required: true
  },
  
  provider: {
    type: String,
    required: true,
    trim: true
  },
  
  departureLocation: {
    type: String,
    required: true,
    trim: true
  },
  
  arrivalLocation: {
    type: String,
    required: true,
    trim: true
  },
  
  departureTime: {
    type: String,
    required: true
  },
  
  arrivalTime: {
    type: String,
    required: true
  },
  
  price: {
    type: Number,
    required: true
  },
  
  currency: {
    type: String,
    default: "USD"
  },
  
  availableSeats: {
    type: Number,
    required: true,
    min: 0
  },
  
  totalSeats: {
    type: Number,
    required: true
  },
  
  vehicleInfo: {
    model: String,
    features: [String]
  },
  
  duration: {
    type: String, // e.g., "2h 30m"
    required: true
  },
  
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient searching
transportProviderSchema.index({ 
  type: 1, 
  departureLocation: 1, 
  arrivalLocation: 1,
  isActive: 1
});

module.exports = mongoose.model("TransportProvider", transportProviderSchema);
