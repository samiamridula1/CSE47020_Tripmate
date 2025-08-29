const mongoose = require('mongoose');
const TransportProvider = require('./models/TransportProvider');
require('dotenv').config();

const DB_URI = process.env.MONGO_URI || "mongodb+srv://samiarahmanmridula:Mri2dul%40%23@cluster1.1ia48ij.mongodb.net/tripmate?retryWrites=true&w=majority&appName=Cluster1";

const transportProviders = [
  // Bus Services
  {
    type: "bus",
    provider: "Green Line Paribahan",
    vehicleInfo: {
      model: "AC Sleeper Coach",
      features: ["AC", "WiFi", "Snacks", "Blanket"]
    },
    departureLocation: "Dhaka",
    arrivalLocation: "Cox's Bazar",
    departureTime: "10:00 PM",
    arrivalTime: "8:00 AM",
    duration: "10h",
    price: 2500,
    currency: "BDT",
    totalSeats: 36,
    availableSeats: 12,
    isActive: true
  },
  {
    type: "bus",
    provider: "Shyamoli NR Travels",
    vehicleInfo: {
      model: "AC Business",
      features: ["AC", "Reclining Seats", "Entertainment"]
    },
    departureLocation: "Dhaka",
    arrivalLocation: "Sylhet",
    departureTime: "11:00 PM",
    arrivalTime: "7:00 AM",
    duration: "8h",
    price: 1800,
    currency: "BDT",
    totalSeats: 32,
    availableSeats: 8,
    isActive: true
  },
  {
    type: "bus",
    provider: "Hanif Enterprise",
    vehicleInfo: {
      model: "AC Sleeper",
      features: ["AC", "Sleeper", "Blanket"]
    },
    departureLocation: "Dhaka",
    arrivalLocation: "Chittagong",
    departureTime: "9:30 PM",
    arrivalTime: "6:30 AM",
    duration: "9h",
    price: 2000,
    currency: "BDT",
    totalSeats: 40,
    availableSeats: 15,
    isActive: true
  },
  {
    type: "bus",
    provider: "Ena Transport",
    vehicleInfo: {
      model: "AC Chair Coach",
      features: ["AC", "Comfortable Seats"]
    },
    departureLocation: "Dhaka",
    arrivalLocation: "Rangpur",
    departureTime: "8:00 AM",
    arrivalTime: "4:00 PM",
    duration: "8h",
    price: 1200,
    currency: "BDT",
    totalSeats: 45,
    availableSeats: 20,
    isActive: true
  },
  {
    type: "bus",
    provider: "Soudia Transport",
    vehicleInfo: {
      model: "Non-AC",
      features: ["Comfortable Seats", "Regular Service"]
    },
    departureLocation: "Dhaka",
    arrivalLocation: "Khulna",
    departureTime: "7:00 AM",
    arrivalTime: "2:00 PM",
    duration: "7h",
    price: 800,
    currency: "BDT",
    totalSeats: 50,
    availableSeats: 25,
    isActive: true
  },

  // Train Services
  {
    type: "train",
    provider: "Bangladesh Railway",
    vehicleInfo: {
      model: "Shovan Chair - Parabat Express",
      features: ["Chair Car", "Affordable"]
    },
    departureLocation: "Dhaka",
    arrivalLocation: "Sylhet",
    departureTime: "6:00 AM",
    arrivalTime: "12:30 PM",
    duration: "6h 30m",
    price: 350,
    currency: "BDT",
    totalSeats: 72,
    availableSeats: 30,
    isActive: true
  },
  {
    type: "train",
    provider: "Bangladesh Railway",
    vehicleInfo: {
      model: "AC Chair - Upaban Express",
      features: ["AC", "Chair Car", "Meals Available"]
    },
    departureLocation: "Dhaka",
    arrivalLocation: "Chittagong",
    departureTime: "3:00 PM",
    arrivalTime: "10:30 PM",
    duration: "7h 30m",
    price: 850,
    currency: "BDT",
    totalSeats: 64,
    availableSeats: 18,
    isActive: true
  },
  {
    type: "train",
    provider: "Bangladesh Railway",
    vehicleInfo: {
      model: "Shovan Chair - Rangpur Express",
      features: ["Chair Car", "Night Journey"]
    },
    departureLocation: "Dhaka",
    arrivalLocation: "Rangpur",
    departureTime: "9:00 PM",
    arrivalTime: "6:00 AM",
    duration: "9h",
    price: 450,
    currency: "BDT",
    totalSeats: 72,
    availableSeats: 22,
    isActive: true
  },

  // Flight Services
  {
    type: "flight",
    provider: "Biman Bangladesh Airlines",
    vehicleInfo: {
      model: "Boeing 737-800",
      features: ["In-flight Meals", "Baggage Allowance", "Fast Travel"]
    },
    departureLocation: "Dhaka",
    arrivalLocation: "Chittagong",
    departureTime: "8:00 AM",
    arrivalTime: "9:00 AM",
    duration: "1h",
    price: 8500,
    currency: "BDT",
    totalSeats: 150,
    availableSeats: 45,
    isActive: true
  },
  {
    type: "flight",
    provider: "Novoair",
    vehicleInfo: {
      model: "ATR 72-600",
      features: ["In-flight Service", "Quick Travel", "Scenic Route"]
    },
    departureLocation: "Dhaka",
    arrivalLocation: "Cox's Bazar",
    departureTime: "2:00 PM",
    arrivalTime: "3:15 PM",
    duration: "1h 15m",
    price: 12000,
    currency: "BDT",
    totalSeats: 70,
    availableSeats: 25,
    isActive: true
  },
  {
    type: "flight",
    provider: "US-Bangla Airlines",
    vehicleInfo: {
      model: "Dash 8-400",
      features: ["Professional Service", "Time Saving"]
    },
    departureLocation: "Dhaka",
    arrivalLocation: "Sylhet",
    departureTime: "6:00 PM",
    arrivalTime: "7:00 PM",
    duration: "1h",
    price: 9500,
    currency: "BDT",
    totalSeats: 74,
    availableSeats: 12,
    isActive: true
  },

  // Car Rental Services
  {
    type: "car",
    provider: "Dhaka Car Rental",
    vehicleInfo: {
      model: "Toyota Axio (AC)",
      features: ["AC", "Driver Included", "Fuel Included", "Flexible Timing"]
    },
    departureLocation: "Dhaka",
    arrivalLocation: "Cox's Bazar",
    departureTime: "Any Time",
    arrivalTime: "8 Hours Drive",
    duration: "8h",
    price: 15000,
    currency: "BDT",
    totalSeats: 4,
    availableSeats: 2,
    isActive: true
  },
  {
    type: "car",
    provider: "Bengal Tours",
    vehicleInfo: {
      model: "Microbus (AC)",
      features: ["AC", "Driver Included", "Spacious", "Family Friendly"]
    },
    departureLocation: "Dhaka",
    arrivalLocation: "Sylhet",
    departureTime: "Any Time",
    arrivalTime: "6 Hours Drive",
    duration: "6h",
    price: 18000,
    currency: "BDT",
    totalSeats: 8,
    availableSeats: 1,
    isActive: true
  },
  {
    type: "car",
    provider: "Comfort Ride",
    vehicleInfo: {
      model: "Honda City (AC)",
      features: ["AC", "Professional Driver", "Comfortable"]
    },
    departureLocation: "Dhaka",
    arrivalLocation: "Chittagong",
    departureTime: "Any Time",
    arrivalTime: "5 Hours Drive",
    duration: "5h",
    price: 12000,
    currency: "BDT",
    totalSeats: 4,
    availableSeats: 3,
    isActive: true
  },

  // Additional Bus Routes
  {
    type: "bus",
    provider: "Shohagh Paribahan",
    vehicleInfo: {
      model: "AC Sleeper",
      features: ["AC", "Sleeper", "Return Journey"]
    },
    departureLocation: "Cox's Bazar",
    arrivalLocation: "Dhaka",
    departureTime: "10:00 PM",
    arrivalTime: "8:00 AM",
    duration: "10h",
    price: 2200,
    currency: "BDT",
    totalSeats: 36,
    availableSeats: 18,
    isActive: true
  },
  {
    type: "bus",
    provider: "Royal Coach",
    vehicleInfo: {
      model: "AC Business",
      features: ["AC", "Business Class", "Night Service"]
    },
    departureLocation: "Sylhet",
    arrivalLocation: "Dhaka",
    departureTime: "11:30 PM",
    arrivalTime: "7:30 AM",
    duration: "7h 30m",
    price: 1600,
    currency: "BDT",
    totalSeats: 32,
    availableSeats: 14,
    isActive: true
  }
];

async function seedTransport() {
  try {
    await mongoose.connect(DB_URI);
    console.log("Connected to MongoDB");

    // Clear existing transport providers
    await TransportProvider.deleteMany({});
    console.log("Cleared existing transport providers");

    // Insert new transport providers
    const result = await TransportProvider.insertMany(transportProviders);
    console.log(`Inserted ${result.length} transport providers`);

    console.log("Transport seeding completed successfully!");
    
    // Display summary by type
    const typeCounts = transportProviders.reduce((acc, transport) => {
      acc[transport.type] = (acc[transport.type] || 0) + 1;
      return acc;
    }, {});
    
    console.log("\nTransport by type:");
    Object.entries(typeCounts).forEach(([type, count]) => {
      console.log(`${type}: ${count} options`);
    });
    
  } catch (error) {
    console.error("Error seeding transport:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the seeding function
seedTransport();
