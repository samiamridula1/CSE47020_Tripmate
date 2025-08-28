const mongoose = require('mongoose');

const hotelBookingSchema = new mongoose.Schema({
  hotelName: {
    type: String,
    required: true,
    trim: true
  },
  
  location: {
    type: String,
    required: true,
    trim: true
  },
  
  address: {
    type: String,
    required: true,
    trim: true
  },
  
  checkInDate: {
    type: Date,
    required: true
  },
  
  checkOutDate: {
    type: Date,
    required: true
  },
  
  nights: {
    type: Number,
    required: true,
    min: 1
  },
  
  rooms: {
    type: Number,
    default: 1,
    min: 1
  },
  
  roomType: {
    type: String,
    enum: ["single", "double", "suite", "family", "deluxe"],
    default: "double"
  },
  
  price: {
    type: Number,
    required: true
  },
  
  totalPrice: {
    type: Number,
    required: true
  },
  
  currency: {
    type: String,
    default: "BDT"
  },
  
  status: {
    type: String,
    enum: ["confirmed", "cancelled", "pending"],
    default: "confirmed"
  },
  
  bookingCode: {
    type: String,
    trim: true
  },
  
  hotelProviderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HotelProvider"
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
  },
  
  // Keep for backward compatibility
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  
  confirmation: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Hotel", hotelBookingSchema);