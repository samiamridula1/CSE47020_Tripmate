const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

// Get all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

// POST a new review
router.post("/", async (req, res) => {
  try {
    const { user, content, rating, location } = req.body;
    const newReview = new Review({ user, content, rating, location });
    await newReview.save();
    await newReview.populate("user", "name email");
    res.status(201).json({ message: "Review added!", review: newReview });
  } catch (err) {
    console.error("Error adding review:", err);
    res.status(500).json({ message: "Error adding review" });
  }
});

// GET reviews by location
router.get("/location/:location", async (req, res) => {
  try {
    const reviews = await Review.find({ location: req.params.location })
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

// Get reviews by user
router.get("/user/:userId", async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.params.userId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

module.exports = router;
