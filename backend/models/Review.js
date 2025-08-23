const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId: String,
  location: String,
  comment: String,
  rating: Number, // 1 to 5
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Review", reviewSchema);