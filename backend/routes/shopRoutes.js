const express = require("express");
const router = express.Router();
const Shop = require("../models/Shop");

// Get all shops
router.get("/", async (req, res) => {
  try {
    const shops = await Shop.find();
    res.json(shops);
  } catch (err) {
    console.error("Error fetching shops:", err);
    res.status(500).json({ message: "Error fetching shops" });
  }
});

// Add a shop manually
router.post("/", async (req, res) => {
  try {
    const { name, location, description } = req.body;
    const newShop = new Shop({ name, location, description });
    await newShop.save();
    res.status(201).json({ message: "Shop added!", shop: newShop });
  } catch (err) {
    console.error("Error adding shop:", err);
    res.status(500).json({ message: "Error adding shop" });
  }
});

// Get shops by location
router.get("/location/:location", async (req, res) => {
  try {
    const shops = await Shop.find({ location: req.params.location });
    res.json(shops);
  } catch (err) {
    console.error("Error fetching shops:", err);
    res.status(500).json({ message: "Error fetching shops" });
  }
});

module.exports = router;