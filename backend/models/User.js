const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },

  avatarUrl: {
    type: String,
    default: "https://via.placeholder.com/100",
  },
  bio: {
    type: String,
    default: "",
    trim: true,
  },
  interest: {
    type: String,
    default: "",
    trim: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    default: "other",
  },

  // 🧠 Travel Preferences
  visitedDestinations: {
    type: [String],
    default: [],
  },
  preferredTransport: {
    type: String,
    enum: ["flight", "train", "car", "bus"],
    default: "flight",
  },

  groups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "TripGroup",
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model("User", userSchema);