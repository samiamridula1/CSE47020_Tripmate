const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  type: {
    type: String,
    enum: ["city"],
    default: "city",
    required: true
  },
  
  parentLocation: {
    type: String, // Parent division or district
    trim: true
  },
  
  aliases: [{
    type: String, // Alternative names or common misspellings
    trim: true
  }],
  
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Text index for search functionality
locationSchema.index({ 
  name: "text", 
  aliases: "text" 
});

// Regular index for type-based queries
locationSchema.index({ type: 1, isActive: 1 });

module.exports = mongoose.model("Location", locationSchema);
