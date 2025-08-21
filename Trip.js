import express from "express";
import Trip from "../models/Trip.js";
const router = express.Router();

// Create trip
router.post("/", async (req, res) => {
  try {
    const trip = await Trip.create(req.body);
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get trips by user
router.get("/:userId", async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.params.userId });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
