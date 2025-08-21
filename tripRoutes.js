import express from "express";
import Trip from "../models/Trip.js";

const router = express.Router();

// Get trips for a user
router.get("/:userId", async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.params.userId });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new trip
router.post("/", async (req, res) => {
  try {
    const { userId, destination, date, details } = req.body;
    const newTrip = new Trip({ userId, destination, date, details });
    const savedTrip = await newTrip.save();
    res.json(savedTrip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
