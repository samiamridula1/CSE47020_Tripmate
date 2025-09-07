const express = require("express");
const {
    searchHotels,
    getAllHotelBookings,
    createHotelBooking,
    getUserHotelBookings,
    updateHotelBooking,
    deleteHotelBooking,
    getAllHotelProviders,
    createHotelProvider,
} = require("../controllers/hotelController");

const router = express.Router();

// Search available hotels
router.post("/search", searchHotels);

// Get all hotel bookings
router.get("/", getAllHotelBookings);

// Create hotel booking
router.post("/", createHotelBooking);

// Get bookings by user
router.get("/user/:userId", getUserHotelBookings);

// Update booking
router.put("/:id", updateHotelBooking);

// Delete booking
router.delete("/:id", deleteHotelBooking);

// Get providers
router.get("/providers", getAllHotelProviders);

// Add provider
router.post("/providers", createHotelProvider);

// Legacy endpoint for hotel bookings (redirects to main booking endpoint)
router.post("/hotel-bookings", createHotelBooking);

module.exports = router;