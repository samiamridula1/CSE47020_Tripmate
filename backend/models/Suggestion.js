const mongoose = require("mongoose");

const suggestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  location: String,
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    lowercase: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

module.exports = mongoose.model("Suggestion", suggestionSchema);