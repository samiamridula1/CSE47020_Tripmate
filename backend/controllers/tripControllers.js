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

const getUserTrips = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Check if this is a demo user
        if (demoTripsData[userId]) {
            return res.json(demoTripsData[userId]);
        }

        // Otherwise, try to get trips from database
        const trips = await Trip.find({ userId: userId }).sort({ createdAt: -1 });
        res.json(trips);
    } catch (error) {
        console.error('Error fetching user trips:', error);
        res.status(500).json({ message: 'Error fetching trips', error: error.message });
    }
};

const getAllTrips = async (req, res) => {
    try {
        const trips = await Trip.find().sort({ createdAt: -1 });
        res.json(trips);
    } catch (error) {
        console.error('Error fetching all trips:', error);
        res.status(500).json({ message: 'Error fetching trips', error: error.message });
    }
};

// @desc    Create a new trip
// @route   POST /api/trips
// @access  Public
const createTrip = async (req, res) => {
    try {
        const trip = new Trip(req.body);
        await trip.save();
        res.status(201).json(trip);
    } catch (error) {
        console.error('Error creating trip:', error);
        res.status(500).json({ message: 'Error creating trip', error: error.message });
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
            return res.status(404).json({ message: "Trip not found" });
        }

        res.json(trip);
    } catch (error) {
        console.error('Error updating trip:', error);
        res.status(500).json({ message: 'Error updating trip', error: error.message });
    }
};

// @desc    Delete a trip
// @route   DELETE /api/trips/:id
// @access  Public
const deleteTrip = async (req, res) => {
    try {
        const trip = await Trip.findByIdAndDelete(req.params.id);

        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }

        res.json({ message: "Trip deleted successfully" });
    } catch (error) {
        console.error('Error deleting trip:', error);
        res.status(500).json({ message: 'Error deleting trip', error: error.message });
    }
};

// @desc    Add photo to trip
// @route   POST /api/trips/:id/photos
// @access  Public
const addTripPhoto = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        
        trip.photos.push(req.body);
        await trip.save();
        res.json(trip);
    } catch (error) {
        console.error('Error adding photo to trip:', error);
        res.status(500).json({ message: 'Error adding photo', error: error.message });
    }
};

// @desc    Remove photo from trip
// @route   DELETE /api/trips/:id/photos/:photoIndex
// @access  Public
const removeTripPhoto = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        
        const photoIndex = parseInt(req.params.photoIndex);
        if (photoIndex < 0 || photoIndex >= trip.photos.length) {
            return res.status(400).json({ message: 'Invalid photo index' });
        }
        
        trip.photos.splice(photoIndex, 1);
        await trip.save();
        res.json(trip);
    } catch (error) {
        console.error('Error removing photo from trip:', error);
        res.status(500).json({ message: 'Error removing photo', error: error.message });
    }
};

// @desc    Update trip status
// @route   PATCH /api/trips/:id/status
// @access  Public
const updateTripStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['planned', 'in-progress', 'completed', 'cancelled'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        
        const trip = await Trip.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
        );
        
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        
        res.json(trip);
    } catch (error) {
        console.error('Error updating trip status:', error);
        res.status(500).json({ message: 'Error updating status', error: error.message });
    }
};

module.exports = {
    getAllTrips,
    getUserTrips,
    createTrip,
    updateTrip,
    deleteTrip,
    addTripPhoto,
    removeTripPhoto,
    updateTripStatus,
};