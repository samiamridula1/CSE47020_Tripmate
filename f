// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUID: { type: String, required: true, unique: true }, // Link Firebase UID
  name: { type: String },
  email: { type: String, required: true, unique: true },
  avatarUrl: { type: String },
  travelInterests: [String],
  bio: { type: String }
});

module.exports = mongoose.model('User', userSchema);
