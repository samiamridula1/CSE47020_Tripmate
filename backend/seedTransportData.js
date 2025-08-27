const mongoose = require("mongoose");
const TransportProvider = require("./models/TransportProvider");
require('dotenv').config();

// Connect to MongoDB using the same URI as the main app
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB for seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

const sampleProviders = [
  // Flights (domestic and international)
  {
    type: "flight",
    provider: "Biman Bangladesh Airlines",
    departureLocation: "Dhaka",
    arrivalLocation: "Chittagong",
    departureTime: "08:00",
    arrivalTime: "09:15",
    price: 4500,
    currency: "BDT",
    availableSeats: 45,
    totalSeats: 180,
    duration: "1h 15m",
    vehicleInfo: {
      model: "Boeing 737",
      features: ["In-flight meal", "WiFi", "Air conditioning"]
    }
  },
  {
    type: "flight",
    provider: "US-Bangla Airlines",
    departureLocation: "Dhaka",
    arrivalLocation: "Sylhet",
    departureTime: "14:30",
    arrivalTime: "15:45",
    price: 5200,
    currency: "BDT",
    availableSeats: 23,
    totalSeats: 150,
    duration: "1h 15m",
    vehicleInfo: {
      model: "ATR 72",
      features: ["Snacks included", "Air conditioning"]
    }
  },
  {
    type: "flight",
    provider: "NovoAir",
    departureLocation: "Dhaka",
    arrivalLocation: "Cox's Bazar",
    departureTime: "11:00",
    arrivalTime: "12:30",
    price: 6800,
    currency: "BDT",
    availableSeats: 67,
    totalSeats: 200,
    duration: "1h 30m",
    vehicleInfo: {
      model: "Embraer E190",
      features: ["In-flight entertainment", "Premium seats", "Meals included"]
    }
  },

  // Trains
  {
    type: "train",
    provider: "Bangladesh Railway",
    departureLocation: "Dhaka",
    arrivalLocation: "Chittagong",
    departureTime: "07:00",
    arrivalTime: "13:30",
    price: 850,
    currency: "BDT",
    availableSeats: 120,
    totalSeats: 300,
    duration: "6h 30m",
    vehicleInfo: {
      model: "Suborno Express",
      features: ["AC coach", "Sleeper available", "Dining car", "Reserved seating"]
    }
  },
  {
    type: "train",
    provider: "Bangladesh Railway",
    departureLocation: "Dhaka",
    arrivalLocation: "Rajshahi",
    departureTime: "06:45",
    arrivalTime: "13:20",
    price: 650,
    currency: "BDT",
    availableSeats: 89,
    totalSeats: 250,
    duration: "6h 35m",
    vehicleInfo: {
      model: "Padma Express",
      features: ["AC coach", "Non-AC coach", "Snack bar"]
    }
  },
  {
    type: "train",
    provider: "Bangladesh Railway",
    departureLocation: "Dhaka",
    arrivalLocation: "Sylhet",
    departureTime: "21:40",
    arrivalTime: "06:15",
    price: 750,
    currency: "BDT",
    availableSeats: 78,
    totalSeats: 400,
    duration: "8h 35m",
    vehicleInfo: {
      model: "Upaban Express",
      features: ["Sleeper coach", "AC berth", "Dining car", "Night journey"]
    }
  },

  // Buses (AC and Non-AC)
  {
    type: "bus",
    provider: "Green Line Paribahan",
    departureLocation: "Dhaka",
    arrivalLocation: "Chittagong",
    departureTime: "08:00",
    arrivalTime: "14:00",
    price: 650,
    currency: "BDT",
    availableSeats: 35,
    totalSeats: 40,
    duration: "6h 00m",
    vehicleInfo: {
      model: "Volvo AC Bus",
      features: ["Full AC", "Reclining seats", "WiFi", "Snacks included", "TV/Entertainment"]
    }
  },
  {
    type: "bus",
    provider: "Shyamoli Paribahan",
    departureLocation: "Dhaka",
    arrivalLocation: "Rajshahi",
    departureTime: "22:30",
    arrivalTime: "05:30",
    price: 550,
    currency: "BDT",
    availableSeats: 28,
    totalSeats: 36,
    duration: "7h 00m",
    vehicleInfo: {
      model: "Scania AC Sleeper",
      features: ["Full AC", "Sleeper seats", "Blanket provided", "Night journey"]
    }
  },
  {
    type: "bus",
    provider: "Hanif Enterprise",
    departureLocation: "Dhaka",
    arrivalLocation: "Sylhet",
    departureTime: "23:00",
    arrivalTime: "06:00",
    price: 480,
    currency: "BDT",
    availableSeats: 32,
    totalSeats: 45,
    duration: "7h 00m",
    vehicleInfo: {
      model: "AC Bus",
      features: ["AC", "Comfortable seats", "Entertainment system"]
    }
  },
  {
    type: "bus",
    provider: "ENA Transport",
    departureLocation: "Dhaka",
    arrivalLocation: "Khulna",
    departureTime: "07:30",
    arrivalTime: "13:30",
    price: 420,
    currency: "BDT",
    availableSeats: 25,
    totalSeats: 40,
    duration: "6h 00m",
    vehicleInfo: {
      model: "AC Bus",
      features: ["AC", "Reclining seats", "Rest stops"]
    }
  },
  {
    type: "bus",
    provider: "Soudia Transport",
    departureLocation: "Dhaka",
    arrivalLocation: "Barisal",
    departureTime: "08:00",
    arrivalTime: "14:00",
    price: 380,
    currency: "BDT",
    availableSeats: 30,
    totalSeats: 42,
    duration: "6h 00m",
    vehicleInfo: {
      model: "Non-AC Bus",
      features: ["Comfortable seats", "Regular stops", "Affordable"]
    }
  },
  {
    type: "bus",
    provider: "Royal Coach",
    departureLocation: "Chittagong",
    arrivalLocation: "Cox's Bazar",
    departureTime: "09:00",
    arrivalTime: "13:00",
    price: 320,
    currency: "BDT",
    availableSeats: 20,
    totalSeats: 35,
    duration: "4h 00m",
    vehicleInfo: {
      model: "AC Bus",
      features: ["AC", "Scenic route", "Direct service"]
    }
  },

  // Car Rentals
  {
    type: "car",
    provider: "Dhaka Rent-A-Car",
    departureLocation: "Dhaka",
    arrivalLocation: "Chittagong",
    departureTime: "Any time",
    arrivalTime: "Return within 2 days",
    price: 3500,
    currency: "BDT",
    availableSeats: 8,
    totalSeats: 10,
    duration: "1-3 days",
    vehicleInfo: {
      model: "Toyota Premio",
      features: ["AC", "GPS", "Driver included", "Fuel included", "24/7 support"]
    }
  },
  {
    type: "car",
    provider: "Budget Car Rental BD",
    departureLocation: "Dhaka",
    arrivalLocation: "Sylhet",
    departureTime: "Any time",
    arrivalTime: "Return within 3 days",
    price: 4200,
    currency: "BDT",
    availableSeats: 5,
    totalSeats: 6,
    duration: "1-7 days",
    vehicleInfo: {
      model: "Honda Civic",
      features: ["AC", "Self-drive option", "Insurance included", "Hill route suitable"]
    }
  },
  {
    type: "car",
    provider: "Premium Car Services",
    departureLocation: "Dhaka",
    arrivalLocation: "Cox's Bazar",
    departureTime: "Any time",
    arrivalTime: "Return within 5 days",
    price: 6000,
    currency: "BDT",
    availableSeats: 3,
    totalSeats: 4,
    duration: "2-7 days",
    vehicleInfo: {
      model: "Toyota Land Cruiser",
      features: ["4WD", "Luxury interior", "Professional driver", "Beach trip special"]
    }
  }
];

async function seedData() {
  try {
    // Clear existing data
    await TransportProvider.deleteMany({});
    console.log("Cleared existing transport providers");

    // Insert sample data
    await TransportProvider.insertMany(sampleProviders);
    console.log("Sample transport providers added successfully!");
    console.log(`Added ${sampleProviders.length} providers`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding data:", error);
    mongoose.connection.close();
  }
}

seedData();
