const mongoose = require("mongoose");

const TripGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  destination: {
    type: String,
    required: true,
    trim: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  budget: {
    type: Number,
    min: 0
  },
  status: {
    type: String,
    enum: ["planning", "active", "completed", "cancelled"],
    default: "planning"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("TripGroup", TripGroupSchema);
