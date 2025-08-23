const express = require("express");
const router = express.Router();
const TransportBooking = require("../models/TransportBooking");

// Get all transport bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await TransportBooking.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching transport bookings:", err);
    res.status(500).json({ message: "Error fetching transport bookings" });
  }
});

// Create transport booking
router.post("/", async (req, res) => {
  try {
    const booking = new TransportBooking(req.body);
    const saved = await booking.save();
    await saved.populate("user", "name email");
    res.status(201).json({ message: "Transport booking created!", booking: saved });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Failed to save booking" });
  }
});

// Get bookings by user
router.get("/user/:userId", async (req, res) => {
  try {
    const bookings = await TransportBooking.find({ user: req.params.userId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching user bookings:", err);
    res.status(500).json({ message: "Error fetching user bookings" });
  }
});

// Update booking status
router.put("/:id", async (req, res) => {
  try {
    const booking = await TransportBooking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("user", "name email");
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    res.json({ message: "Booking updated!", booking });
  } catch (err) {
    console.error("Error updating booking:", err);
    res.status(500).json({ message: "Error updating booking" });
  }
});

// Delete booking
router.delete("/:id", async (req, res) => {
  try {
    const booking = await TransportBooking.findByIdAndDelete(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    res.json({ message: "Booking deleted!" });
  } catch (err) {
    console.error("Error deleting booking:", err);
    res.status(500).json({ message: "Error deleting booking" });
  }
});

module.exports = router;