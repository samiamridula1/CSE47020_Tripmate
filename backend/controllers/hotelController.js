const Hotel = require("../models/Hotel");
const HotelProvider = require("../models/HotelProvider");

const searchHotels = async (req, res) => {
    try {
        const { location, checkInDate, checkOutDate, rooms = 1 } = req.body;
        
        if (!location || !checkInDate || !checkOutDate) {
            return res.status(400).json({ 
                message: "Location, check-in date, and check-out date are required" 
            });
        }

        const searchDate = new Date(checkInDate);
        const hotels = await HotelProvider.find({
            location: { $regex: new RegExp(location, 'i') },
            availableRooms: { $gte: rooms },
            isActive: true
        }).sort({ price: 1 });

        res.json(hotels);
    } catch (err) {
        console.error("Error searching hotels:", err);
        res.status(500).json({ message: "Error searching hotels" });
    }
};

const getAllHotelBookings = async (req, res) => {
    try {
        const bookings = await Hotel.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        console.error("Error fetching hotel bookings:", err);
        res.status(500).json({ message: "Error fetching hotel bookings" });
    }
};

const createHotelBooking = async (req, res) => {
    try {
        const { hotelProviderId, rooms = 1, nights, ...bookingData } = req.body;
        
        if (hotelProviderId) {
            const provider = await HotelProvider.findById(hotelProviderId);
            if (!provider) {
                return res.status(404).json({ message: "Hotel not found" });
            }
            
            if (provider.availableRooms < rooms) {
                return res.status(400).json({ message: "Not enough rooms available" });
            }
            
            bookingData.hotelName = provider.name;
            bookingData.location = provider.location;
            bookingData.address = provider.address;
            bookingData.roomType = provider.roomType;
            bookingData.price = provider.price;
            bookingData.totalPrice = provider.price * rooms * nights;
            bookingData.currency = provider.currency;
            bookingData.hotelProviderId = hotelProviderId;
            bookingData.rooms = rooms;
            bookingData.nights = nights;
            
            bookingData.bookingCode = `HTL-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
            
            provider.availableRooms -= rooms;
            await provider.save();
        }
        
        const booking = new Hotel(bookingData);
        const saved = await booking.save();
        await saved.populate("user", "name email");
        
        res.status(201).json({ message: "Hotel booking created!", booking: saved });
    } catch (err) {
        console.error("Hotel booking error:", err);
        res.status(500).json({ message: "Failed to save booking" });
    }
};

const getUserHotelBookings = async (req, res) => {
    try {
        const bookings = await Hotel.find({ 
            $or: [
                { user: req.params.userId },
                { userId: req.params.userId }
            ]
        })
            .populate("user", "name email")
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        console.error("Error fetching user hotel bookings:", err);
        res.status(500).json({ message: "Error fetching user hotel bookings" });
    }
};

const updateHotelBooking = async (req, res) => {
    try {
        const booking = await Hotel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate("user", "name email");
        
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        
        res.json({ message: "Hotel booking updated!", booking });
    } catch (err) {
        console.error("Error updating hotel booking:", err);
        res.status(500).json({ message: "Error updating hotel booking" });
    }
};

const deleteHotelBooking = async (req, res) => {
    try {
        const booking = await Hotel.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        
        if (booking.hotelProviderId) {
            const provider = await HotelProvider.findById(booking.hotelProviderId);
            if (provider) {
                provider.availableRooms += booking.rooms || 1;
                await provider.save();
            }
        }
        
        // Mark as cancelled instead of deleting
        booking.status = "cancelled";
        await booking.save();
        
        res.json({ message: "Hotel booking cancelled successfully!" });
    } catch (err) {
        console.error("Error deleting hotel booking:", err);
        res.status(500).json({ message: "Error deleting hotel booking" });
    }
};

const getAllHotelProviders = async (req, res) => {
    try {
        const providers = await HotelProvider.find({ isActive: true })
            .sort({ location: 1, price: 1 });
        res.json(providers);
    } catch (err) {
        console.error("Error fetching hotel providers:", err);
        res.status(500).json({ message: "Error fetching hotel providers" });
    }
};

const createHotelProvider = async (req, res) => {
    try {
        const provider = new HotelProvider(req.body);
        const saved = await provider.save();
        res.status(201).json({ message: "Hotel provider created!", provider: saved });
    } catch (err) {
        console.error("Error creating hotel provider:", err);
        res.status(500).json({ message: "Error creating hotel provider" });
    }
};

const getAllHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.json(hotels);
    } catch (err) {
        console.error('Error fetching hotels:', err);
        res.status(500).json({ error: "Failed to fetch hotels" });
    }
};

module.exports = {
    searchHotels,
    getAllHotelBookings,
    createHotelBooking,
    getUserHotelBookings,
    updateHotelBooking,
    deleteHotelBooking,
    getAllHotelProviders,
    createHotelProvider,
    getAllHotels,
};
