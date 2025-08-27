const express = require("express");
const router = express.Router();
const Location = require("../models/Location");

// Search locations with suggestions
router.get("/search", async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q || q.length < 2) {
      return res.json([]);
    }

    // Create text search query
    const searchQuery = {
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { aliases: { $regex: q, $options: 'i' } }
      ],
      isActive: true
    };

    const locations = await Location.find(searchQuery)
      .select('name type parentLocation')
      .limit(parseInt(limit))
      .sort({ type: 1, name: 1 }); // Prioritize by type (city, district, division)

    // Format results with context
    const formattedResults = locations.map(location => ({
      _id: location._id,
      name: location.name,
      type: location.type,
      fullName: location.parentLocation 
        ? `${location.name}, ${location.parentLocation}`
        : location.name,
      displayName: location.parentLocation 
        ? `${location.name} (${location.parentLocation})`
        : location.name
    }));

    res.json(formattedResults);
  } catch (err) {
    console.error("Error searching locations:", err);
    res.status(500).json({ message: "Error searching locations" });
  }
});

// Get all locations
router.get("/", async (req, res) => {
  try {
    const { type } = req.query;
    const query = { isActive: true };
    
    if (type) {
      query.type = type;
    }

    const locations = await Location.find(query)
      .sort({ type: 1, name: 1 });
    
    res.json(locations);
  } catch (err) {
    console.error("Error fetching locations:", err);
    res.status(500).json({ message: "Error fetching locations" });
  }
});

// Add new location (for admin)
router.post("/", async (req, res) => {
  try {
    const location = new Location(req.body);
    const saved = await location.save();
    res.status(201).json({ message: "Location added!", location: saved });
  } catch (err) {
    console.error("Error adding location:", err);
    res.status(500).json({ message: "Error adding location" });
  }
});

module.exports = router;
