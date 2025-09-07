const express = require("express");
const {
    searchLocations,
    getAllLocations,
    getLocationById,
    createLocation,
} = require("../controllers/locationController");

const router = express.Router();

// Search locations with suggestions
router.get("/search", searchLocations);

// Get all locations
router.get("/", getAllLocations);

// Get location by ID
router.get("/:id", getLocationById);

// Create new location
router.post("/", createLocation);

module.exports = router;
