const Trip = require("../models/Trip");

// Demo trips data
const demoTripsData = {
    "demo-user-001": [
        {
            _id: "demo-trip-1",
            userId: "demo-user-001",
            destination: "Paris, France",
            date: "2025-09-15",
            details:
                "Visiting the Eiffel Tower, Louvre Museum, and enjoying French cuisine. Planning to stay for 5 days.",
            status: "planned",
            createdAt: new Date("2025-08-20"),
        },
        {
            _id: "demo-trip-2",
            userId: "demo-user-001",
            destination: "Tokyo, Japan",
            date: "2025-11-22",
            details:
                "Exploring Japanese culture, visiting temples, and experiencing the bustling city life. 7-day adventure!",
            status: "planned",
            createdAt: new Date("2025-08-21"),
        },
        {
            _id: "demo-trip-3",
            userId: "demo-user-001",
            destination: "New York, USA",
            date: "2025-07-10",
            details:
                "Visited Times Square, Central Park, and Broadway shows. Amazing 4-day trip!",
            status: "completed",
            createdAt: new Date("2025-07-05"),
        },
    ],
    "demo-user-002": [
        {
            _id: "demo-trip-4",
            userId: "demo-user-002",
            destination: "Swiss Alps, Switzerland",
            date: "2025-10-05",
            details:
                "Hiking in the beautiful Swiss Alps, staying in mountain chalets. Perfect for photography!",
            status: "planned",
            createdAt: new Date("2025-08-19"),
        },
        {
            _id: "demo-trip-5",
            userId: "demo-user-002",
            destination: "Machu Picchu, Peru",
            date: "2025-12-01",
            details:
                "Trekking to the ancient Incan ruins, experiencing local culture and history.",
            status: "planned",
            createdAt: new Date("2025-08-22"),
        },
        {
            _id: "demo-trip-6",
            userId: "demo-user-002",
            destination: "Tuscany, Italy",
            date: "2025-06-20",
            details:
                "Wine tasting tour through the beautiful Tuscan countryside. Unforgettable experience!",
            status: "completed",
            createdAt: new Date("2025-06-15"),
        },
    ],
};

// @desc    Get trips for a user
// @route   GET /api/trips/:userId
// @access  Public
const getUserTrips = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Check if this is a demo user
        if (demoTripsData[userId]) {
            return res.json(demoTripsData[userId]);
        }

        // Otherwise, try to get trips from database
        const trips = await Trip.find({ userId: userId });
        res.json(trips);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Create a new trip
// @route   POST /api/trips
// @access  Public
const createTrip = async (req, res) => {
    try {
        const { userId, destination, date, details } = req.body;
        const newTrip = new Trip({ userId, destination, date, details });
        const savedTrip = await newTrip.save();
        res.json(savedTrip);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Update a trip
// @route   PUT /api/trips/:id
// @access  Public
const updateTrip = async (req, res) => {
    try {
        const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        if (!trip) {
            return res.status(404).json({ error: "Trip not found" });
        }

        res.json(trip);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Delete a trip
// @route   DELETE /api/trips/:id
// @access  Public
const deleteTrip = async (req, res) => {
    try {
        const trip = await Trip.findByIdAndDelete(req.params.id);

        if (!trip) {
            return res.status(404).json({ error: "Trip not found" });
        }

        res.json({ message: "Trip deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getUserTrips,
    createTrip,
    updateTrip,
    deleteTrip,
};