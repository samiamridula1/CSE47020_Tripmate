const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema({
  story: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  imageUrl: { type: String }, // If using Cloudinary or external hosting
  location: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Experience", experienceSchema);