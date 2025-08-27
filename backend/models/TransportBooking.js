const mongoose = require("mongoose");

const transportBookingSchema = new mongoose.Schema({
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

  bookingCode: {
    type: String,
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

  date: {
    type: Date,
    required: true
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
  
  seats: {
    type: Number,
    default: 1,
    min: 1
  },
  
  status: {
    type: String,
    enum: ["confirmed", "cancelled", "pending"],
    default: "confirmed"
  },
  
  transportProviderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TransportProvider"
  },

  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip",
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("TransportBooking", transportBookingSchema);