const TransportBooking = require("../models/TransportBooking");
const TransportProvider = require("../models/TransportProvider");

const searchTransportOptions = async (req, res) => {
    try {
        const { type, departureLocation, arrivalLocation, date } = req.body;
        
        if (!type || !departureLocation || !arrivalLocation || !date) {
            return res.status(400).json({ 
                message: "Type, departure location, arrival location, and date are required" 
            });
        }

        const searchDate = new Date(date);
        const providers = await TransportProvider.find({
            type,
            departureLocation: { $regex: new RegExp(departureLocation, 'i') },
            arrivalLocation: { $regex: new RegExp(arrivalLocation, 'i') },
            availableSeats: { $gt: 0 },
            isActive: true
        }).sort({ price: 1 });

        res.json(providers);
    } catch (err) {
        console.error("Error searching transport options:", err);
        res.status(500).json({ message: "Error searching transport options" });
    }
};

const getAllTransportBookings = async (req, res) => {
    try {
        const bookings = await TransportBooking.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        console.error("Error fetching transport bookings:", err);
        res.status(500).json({ message: "Error fetching transport bookings" });
    }
};

const createTransportBooking = async (req, res) => {
    try {
        const { transportProviderId, seats = 1, ...bookingData } = req.body;
        
        if (transportProviderId) {
            const provider = await TransportProvider.findById(transportProviderId);
            if (!provider) {
                return res.status(404).json({ message: "Transport provider not found" });
            }
            
            if (provider.availableSeats < seats) {
                return res.status(400).json({ message: "Not enough seats available" });
            }
            
            bookingData.type = provider.type;
            bookingData.provider = provider.provider;
            bookingData.departureLocation = provider.departureLocation;
            bookingData.arrivalLocation = provider.arrivalLocation;
            bookingData.date = bookingData.date || new Date();
            bookingData.departureTime = provider.departureTime;
            bookingData.arrivalTime = provider.arrivalTime;
            bookingData.price = provider.price * seats;
            bookingData.currency = provider.currency;
            bookingData.transportProviderId = transportProviderId;
            bookingData.seats = seats;
            
            bookingData.bookingCode = `${provider.type.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
            
            provider.availableSeats -= seats;
            await provider.save();
        }
        
        const booking = new TransportBooking(bookingData);
        const saved = await booking.save();
        await saved.populate("user", "name email");
        
        res.status(201).json({ message: "Transport booking created!", booking: saved });
    } catch (err) {
        console.error("Booking error:", err);
        res.status(500).json({ message: "Failed to save booking" });
    }
};

const getUserTransportBookings = async (req, res) => {
    try {
        const bookings = await TransportBooking.find({ user: req.params.userId })
            .populate("user", "name email")
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        console.error("Error fetching user bookings:", err);
        res.status(500).json({ message: "Error fetching user bookings" });
    }
};

const updateTransportBooking = async (req, res) => {
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
};

const deleteTransportBooking = async (req, res) => {
    try {
        const booking = await TransportBooking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        
        if (booking.transportProviderId) {
            const provider = await TransportProvider.findById(booking.transportProviderId);
            if (provider) {
                provider.availableSeats += booking.seats;
                await provider.save();
            }
        }
        
        booking.status = "cancelled";
        await booking.save();
        
        res.json({ message: "Booking cancelled successfully!" });
    } catch (err) {
        console.error("Error cancelling booking:", err);
        res.status(500).json({ message: "Error cancelling booking" });
    }
};

const getAllTransportProviders = async (req, res) => {
    try {
        const providers = await TransportProvider.find({ isActive: true });
        res.json(providers);
    } catch (err) {
        console.error("Error fetching providers:", err);
        res.status(500).json({ message: "Error fetching providers" });
    }
};

const createTransportProvider = async (req, res) => {
    try {
        const provider = new TransportProvider(req.body);
        const saved = await provider.save();
        res.status(201).json({ message: "Transport provider added!", provider: saved });
    } catch (err) {
        console.error("Error adding provider:", err);
        res.status(500).json({ message: "Error adding provider" });
    }
};

module.exports = {
    searchTransportOptions,
    getAllTransportBookings,
    createTransportBooking,
    getUserTransportBookings,
    updateTransportBooking,
    deleteTransportBooking,
    getAllTransportProviders,
    createTransportProvider,
};
