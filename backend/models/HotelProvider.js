const mongoose = require("mongoose");

const hotelProviderSchema = new mongoose.Schema({
  name: {
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
  
  price: {
    type: Number,
    required: true
  },
  
  currency: {
    type: String,
    default: "BDT"
  },
  
  availableRooms: {
    type: Number,
    required: true,
    min: 0
  },
  
  totalRooms: {
    type: Number,
    required: true
  },
  
  roomType: {
    type: String,
    enum: ["single", "double", "suite", "family", "deluxe"],
    default: "double"
  },
  
  amenities: [{
    type: String
  }],
  
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  
  images: [{
    type: String
  }],
  
  description: {
    type: String,
    trim: true
  },
  
  contactInfo: {
    phone: String,
    email: String
  },
  
  checkInTime: {
    type: String,
    default: "14:00"
  },
  
  checkOutTime: {
    type: String,
    default: "12:00"
  },
  
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient searching
hotelProviderSchema.index({ 
  location: 1, 
  isActive: 1,
  availableRooms: 1
});

module.exports = mongoose.model("HotelProvider", hotelProviderSchema);
