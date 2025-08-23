const mongoose = require("mongoose");

const transportBookingSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["flight", "train", "bus", "car"],
    required: true
  },

  travelerName: {
    type: String,
    required: true,
    trim: true
  },

  bookingCode: {
    type: String,
    required: true,
    unique: true,
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

  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip",
    required: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("TransportBooking", transportBookingSchema);