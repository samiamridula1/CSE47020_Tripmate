const express = require("express");
const {
    searchTransportOptions,
    getAllTransportBookings,
    createTransportBooking,
    getUserTransportBookings,
    updateTransportBooking,
    deleteTransportBooking,
    getAllTransportProviders,
    createTransportProvider,
} = require("../controllers/transportController");

const router = express.Router();

// Search available transport options
router.post("/search", searchTransportOptions);

// Get all transport bookings
router.get("/", getAllTransportBookings);

// Create transport booking
router.post("/", createTransportBooking);

// Get bookings by user
router.get("/user/:userId", getUserTransportBookings);

// Update booking status
router.put("/:id", updateTransportBooking);

// Delete booking (Cancel booking)
router.delete("/:id", deleteTransportBooking);

// Get providers (for admin to add/manage)
router.get("/providers", getAllTransportProviders);

// Add provider (for admin)
router.post("/providers", createTransportProvider);

module.exports = router;