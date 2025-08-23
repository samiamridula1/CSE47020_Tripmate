const express = require("express");
const router = express.Router();
const Suggestion = require("../models/Suggestion");

// Create a new suggestion
router.post("/", async (req, res) => {
  try {
    const { title, description, location, gender, userId } = req.body;

    const newSuggestion = new Suggestion({
      title,
      description,
      location,
      gender,
      userId
    });

    const saved = await newSuggestion.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error saving suggestion:", err);
    res.status(500).json({ message: "Error saving suggestion" });
  }
});

// Get all suggestions
router.get("/", async (req, res) => {
  try {
    const suggestions = await Suggestion.find().populate('userId', 'name email');
    res.json(suggestions);
  } catch (err) {
    console.error("Error fetching suggestions:", err);
    res.status(500).json({ message: "Error fetching suggestions" });
  }
});

// Get suggestions by gender
router.get("/gender/:gender", async (req, res) => {
  try {
    const userSuggestions = await Suggestion.find({ 
      gender: req.params.gender 
    }).populate('userId', 'name email');
    res.json(userSuggestions);
  } catch (err) {
    console.error("Error fetching user suggestions:", err);
    res.status(500).json({ message: "Error fetching user suggestions" });
  }
});

// Get suggestions by user
router.get("/user/:userId", async (req, res) => {
  try {
    const userSuggestions = await Suggestion.find({ userId: req.params.userId }).populate('userId', 'name email');
    res.json(userSuggestions);
  } catch (err) {
    console.error("Error fetching user suggestions:", err);
    res.status(500).json({ message: "Error fetching user suggestions" });
  }
});

// Delete a suggestion
router.delete("/:id", async (req, res) => {
  try {
    await Suggestion.findByIdAndDelete(req.params.id);
    res.json({ message: "Suggestion deleted" });
  } catch (err) {
    console.error("Error deleting suggestion:", err);
    res.status(500).json({ message: "Error deleting suggestion" });
  }
});

module.exports = router;