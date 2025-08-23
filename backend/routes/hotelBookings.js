const express = require("express");
const router = express.Router();
const Hotel = require("../models/Hotel");

router.post("/hotel-bookings", async (req, res) => {
  try {
    const { name, address, price, userId } = req.body;
    const newHotel = new Hotel({ name, address, price, userId });
    await newHotel.save();
    res.status(201).json(newHotel);
  } catch (err) {
    res.status(500).json({ error: "Failed to book hotel" });
  }
});

module.exports = router;