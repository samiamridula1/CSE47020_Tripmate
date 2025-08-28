const mongoose = require('mongoose');
const HotelProvider = require('./models/HotelProvider');
require('dotenv').config();

const DB_URI = process.env.MONGO_URI || "mongodb+srv://samiarahmanmridula:Mri2dul%40%23@cluster1.1ia48ij.mongodb.net/tripmate?retryWrites=true&w=majority&appName=Cluster1";

const hotelProviders = [
  // Dhaka Hotels
  {
    name: "Pan Pacific Sonargaon Dhaka",
    location: "Dhaka",
    address: "107 Kazi Nazrul Islam Avenue, Dhaka",
    rating: 5,
    roomType: "deluxe",
    totalRooms: 150,
    availableRooms: 45,
    price: 15000,
    currency: "BDT",
    amenities: ["WiFi", "Swimming Pool", "Spa", "Gym", "Restaurant", "Conference Rooms", "Airport Shuttle"],
    description: "Luxury 5-star hotel in the heart of Dhaka with world-class amenities and service."
  },
  {
    name: "Hotel Ruposhi Bangla",
    location: "Dhaka",
    address: "1 Minto Road, Dhaka",
    rating: 4,
    roomType: "double",
    totalRooms: 120,
    availableRooms: 38,
    price: 8500,
    currency: "BDT",
    amenities: ["WiFi", "Restaurant", "Gym", "Business Center", "Room Service"],
    description: "Historic hotel offering comfortable accommodation in central Dhaka."
  },
  {
    name: "Six Seasons Hotel",
    location: "Dhaka",
    address: "Gulshan Avenue, Dhaka",
    rating: 5,
    roomType: "suite",
    totalRooms: 100,
    availableRooms: 22,
    price: 20000,
    currency: "BDT",
    amenities: ["WiFi", "Swimming Pool", "Spa", "Multiple Restaurants", "Gym", "Rooftop Bar"],
    description: "Modern luxury hotel in Gulshan with exceptional dining and entertainment options."
  },

  // Cox's Bazar Hotels
  {
    name: "Royal Tulip Sea Pearl Beach Resort",
    location: "Cox's Bazar",
    address: "Hotel Motel Zone, Cox's Bazar",
    rating: 5,
    roomType: "suite",
    totalRooms: 200,
    availableRooms: 85,
    price: 18000,
    currency: "BDT",
    amenities: ["Beach Access", "Swimming Pool", "Spa", "Multiple Restaurants", "Water Sports", "Kids Club"],
    description: "Beachfront resort offering spectacular views of the world's longest natural sea beach."
  },
  {
    name: "Ocean Paradise Hotel",
    location: "Cox's Bazar",
    address: "Kolatoli Road, Cox's Bazar",
    rating: 4,
    roomType: "double",
    totalRooms: 80,
    availableRooms: 32,
    price: 6500,
    currency: "BDT",
    amenities: ["Beach Access", "Restaurant", "WiFi", "Swimming Pool"],
    description: "Comfortable beachside hotel with easy access to Cox's Bazar beach."
  },
  {
    name: "Hotel Sea Crown",
    location: "Cox's Bazar",
    address: "New Beach Road, Cox's Bazar",
    rating: 3,
    roomType: "single",
    totalRooms: 60,
    availableRooms: 28,
    price: 3500,
    currency: "BDT",
    amenities: ["WiFi", "Restaurant", "Room Service"],
    description: "Budget-friendly hotel near Cox's Bazar beach with basic amenities."
  },

  // Sylhet Hotels
  {
    name: "Rose View Hotel",
    location: "Sylhet",
    address: "Zindabazar, Sylhet",
    rating: 4,
    roomType: "double",
    totalRooms: 70,
    availableRooms: 25,
    price: 5500,
    currency: "BDT",
    amenities: ["WiFi", "Restaurant", "Conference Room", "Room Service"],
    description: "Well-appointed hotel in central Sylhet with modern facilities."
  },
  {
    name: "Hotel Grand Sylhet",
    location: "Sylhet",
    address: "Chowhatta, Sylhet",
    rating: 5,
    roomType: "deluxe",
    totalRooms: 90,
    availableRooms: 18,
    price: 12000,
    currency: "BDT",
    amenities: ["WiFi", "Swimming Pool", "Spa", "Restaurant", "Gym", "Business Center"],
    description: "Luxury hotel offering premium accommodation in the tea capital of Bangladesh."
  },

  // Chittagong Hotels
  {
    name: "Peninsula Chittagong",
    location: "Chittagong",
    address: "486/B, O.R. Nizam Road, Chittagong",
    rating: 5,
    roomType: "deluxe",
    totalRooms: 110,
    availableRooms: 35,
    price: 14000,
    currency: "BDT",
    amenities: ["WiFi", "Swimming Pool", "Spa", "Multiple Restaurants", "Gym", "Business Center"],
    description: "International standard luxury hotel in the commercial capital of Bangladesh."
  },
  {
    name: "Hotel Agrabad",
    location: "Chittagong",
    address: "Agrabad Commercial Area, Chittagong",
    rating: 4,
    roomType: "double",
    totalRooms: 85,
    availableRooms: 42,
    price: 7000,
    currency: "BDT",
    amenities: ["WiFi", "Restaurant", "Conference Rooms", "Business Center"],
    description: "Business hotel located in the heart of Chittagong's commercial district."
  },

  // Bandarban Hotels
  {
    name: "Hill View Resort",
    location: "Bandarban",
    address: "Sangu River Road, Bandarban",
    rating: 4,
    roomType: "family",
    totalRooms: 40,
    availableRooms: 15,
    price: 8000,
    currency: "BDT",
    amenities: ["Mountain View", "Restaurant", "Hiking Trails", "Bonfire Area", "WiFi"],
    description: "Mountain resort offering panoramic views of the Chittagong Hill Tracts."
  },
  {
    name: "Green Hill Resort",
    location: "Bandarban",
    address: "Chimbuk Hill Road, Bandarban",
    rating: 3,
    roomType: "double",
    totalRooms: 25,
    availableRooms: 12,
    price: 4500,
    currency: "BDT",
    amenities: ["Mountain View", "Restaurant", "Nature Walks"],
    description: "Eco-friendly resort nestled in the hills of Bandarban."
  },

  // Khulna Hotels
  {
    name: "Hotel Castle Salam",
    location: "Khulna",
    address: "South Central Road, Khulna",
    rating: 4,
    roomType: "double",
    totalRooms: 65,
    availableRooms: 23,
    price: 6000,
    currency: "BDT",
    amenities: ["WiFi", "Restaurant", "Conference Room", "Room Service"],
    description: "Modern hotel in Khulna city center, perfect for Sundarbans visitors."
  },

  // Rajshahi Hotels
  {
    name: "Hotel Nice International",
    location: "Rajshahi",
    address: "Station Road, Rajshahi",
    rating: 3,
    roomType: "single",
    totalRooms: 50,
    availableRooms: 20,
    price: 3000,
    currency: "BDT",
    amenities: ["WiFi", "Restaurant", "Room Service"],
    description: "Comfortable accommodation in the silk city of Rajshahi."
  },

  // Bogura Hotels
  {
    name: "Hotel Naz Garden",
    location: "Bogura",
    address: "Rangpur Road, Bogura",
    rating: 3,
    roomType: "double",
    totalRooms: 40,
    availableRooms: 18,
    price: 4000,
    currency: "BDT",
    amenities: ["WiFi", "Restaurant", "Garden View"],
    description: "Peaceful hotel with garden setting in historic Bogura."
  },

  // Rangpur Hotels
  {
    name: "Hotel Golden Park",
    location: "Rangpur",
    address: "Station Road, Rangpur",
    rating: 3,
    roomType: "double",
    totalRooms: 35,
    availableRooms: 16,
    price: 3500,
    currency: "BDT",
    amenities: ["WiFi", "Restaurant", "Conference Room"],
    description: "Well-located hotel in Rangpur with modern amenities."
  },

  // Barisal Hotels
  {
    name: "Hotel Arena",
    location: "Barisal",
    address: "Band Road, Barisal",
    rating: 3,
    roomType: "single",
    totalRooms: 30,
    availableRooms: 14,
    price: 2800,
    currency: "BDT",
    amenities: ["WiFi", "Restaurant"],
    description: "Simple and clean accommodation in the Venice of Bengal."
  },

  // Mymensingh Hotels
  {
    name: "Hotel Elite International",
    location: "Mymensingh",
    address: "Choto Bazar, Mymensingh",
    rating: 3,
    roomType: "double",
    totalRooms: 45,
    availableRooms: 19,
    price: 3800,
    currency: "BDT",
    amenities: ["WiFi", "Restaurant", "Room Service"],
    description: "Comfortable hotel in the educational hub of Mymensingh."
  },

  // Cumilla Hotels
  {
    name: "Hotel Safin International",
    location: "Cumilla",
    address: "Kandirpar, Cumilla",
    rating: 3,
    roomType: "double",
    totalRooms: 40,
    availableRooms: 17,
    price: 3200,
    currency: "BDT",
    amenities: ["WiFi", "Restaurant"],
    description: "Modern hotel in historic Cumilla city."
  }
];

async function seedHotels() {
  try {
    await mongoose.connect(DB_URI);
    console.log("Connected to MongoDB");

    // Clear existing hotel providers
    await HotelProvider.deleteMany({});
    console.log("Cleared existing hotel providers");

    // Insert new hotel providers
    const result = await HotelProvider.insertMany(hotelProviders);
    console.log(`Inserted ${result.length} hotel providers`);

    console.log("Hotel seeding completed successfully!");
    
    // Display summary by location
    const locationCounts = hotelProviders.reduce((acc, hotel) => {
      acc[hotel.location] = (acc[hotel.location] || 0) + 1;
      return acc;
    }, {});
    
    console.log("\nHotels by location:");
    Object.entries(locationCounts).forEach(([location, count]) => {
      console.log(`${location}: ${count} hotels`);
    });
    
  } catch (error) {
    console.error("Error seeding hotels:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the seeding function
seedHotels();
