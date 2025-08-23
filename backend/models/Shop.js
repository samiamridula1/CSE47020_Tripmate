const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  name: String,
  location: String, // e.g., "Cox's Bazar", "Dhanmondi"
  description: String
});

module.exports = mongoose.model("Shop", shopSchema);