const express = require("express");
const router = express.Router();
const Hotel = require("../models/Hotel");
const HotelProvider = require("../models/HotelProvider");

// Search available hotels
router.post("/search", async (req, res) => {
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
});

// Get all hotel bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Hotel.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching hotel bookings:", err);
    res.status(500).json({ message: "Error fetching hotel bookings" });
  }
});

// Create hotel booking
router.post("/", async (req, res) => {
  try {
    const { hotelProviderId, rooms = 1, nights, ...bookingData } = req.body;
    
    // If booking from a provider, get provider details and check availability
    if (hotelProviderId) {
      const provider = await HotelProvider.findById(hotelProviderId);
      if (!provider) {
        return res.status(404).json({ message: "Hotel not found" });
      }
      
      if (provider.availableRooms < rooms) {
        return res.status(400).json({ message: "Not enough rooms available" });
      }
      
      // Update booking data with provider details
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
      
      // Generate booking code
      bookingData.bookingCode = `HTL-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      
      // Reduce available rooms
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
});

// Get bookings by user
router.get("/user/:userId", async (req, res) => {
  try {
    const bookings = await Hotel.find({ 
      $or: [
        { user: req.params.userId },
        { userId: req.params.userId } // For backward compatibility
      ]
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching user hotel bookings:", err);
    res.status(500).json({ message: "Error fetching user hotel bookings" });
  }
});

// Update booking
router.put("/:id", async (req, res) => {
  try {
    const booking = await Hotel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("user", "name email");
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    res.json({ message: "Booking updated!", booking });
  } catch (err) {
    console.error("Error updating hotel booking:", err);
    res.status(500).json({ message: "Error updating booking" });
  }
});

// Cancel booking
router.delete("/:id", async (req, res) => {
  try {
    const booking = await Hotel.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    // If booking was made through a provider, restore rooms
    if (booking.hotelProviderId) {
      const provider = await HotelProvider.findById(booking.hotelProviderId);
      if (provider) {
        provider.availableRooms += booking.rooms;
        await provider.save();
      }
    }
    
    // Mark as cancelled instead of deleting
    booking.status = "cancelled";
    await booking.save();
    
    res.json({ message: "Hotel booking cancelled successfully!" });
  } catch (err) {
    console.error("Error cancelling hotel booking:", err);
    res.status(500).json({ message: "Error cancelling booking" });
  }
});

// Get providers (for admin to add/manage)
router.get("/providers", async (req, res) => {
  try {
    const providers = await HotelProvider.find({ isActive: true });
    res.json(providers);
  } catch (err) {
    console.error("Error fetching hotel providers:", err);
    res.status(500).json({ message: "Error fetching hotel providers" });
  }
});

// Add provider (for admin)
router.post("/providers", async (req, res) => {
  try {
    const provider = new HotelProvider(req.body);
    const saved = await provider.save();
    res.status(201).json({ message: "Hotel provider added!", provider: saved });
  } catch (err) {
    console.error("Error adding hotel provider:", err);
    res.status(500).json({ message: "Error adding hotel provider" });
  }
});

// Legacy route for backward compatibility
router.post("/hotel-bookings", async (req, res) => {
  try {
    const { name, address, price, userId } = req.body;
    const newHotel = new Hotel({ 
      hotelName: name,
      address, 
      price,
      totalPrice: price,
      user: userId,
      userId, // For backward compatibility
      checkInDate: new Date(),
      checkOutDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next day
      nights: 1,
      location: address
    });
    await newHotel.save();
    res.status(201).json(newHotel);
  } catch (err) {
    res.status(500).json({ error: "Failed to book hotel" });
  }
});

module.exports = router;