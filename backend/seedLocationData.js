const mongoose = require("mongoose");
const Location = require("./models/Location");
require('dotenv').config();

// Connect to MongoDB using the same URI as the main app
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB for location seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

const bangladeshLocations = [
  // Major cities only - no divisions/districts to avoid confusion
  {
    name: "Dhaka",
    type: "city",
    parentLocation: null,
    aliases: ["Dhaca", "Dacca", "Daka", "Dhakka", "Dhaka City"],
    coordinates: { latitude: 23.8103, longitude: 90.4125 }
  },
  {
    name: "Chittagong",
    type: "city", 
    parentLocation: null,
    aliases: ["Chattogram", "Chatogram", "Chittagang", "CTG"],
    coordinates: { latitude: 22.3569, longitude: 91.7832 }
  },
  {
    name: "Sylhet",
    type: "city",
    parentLocation: null,
    aliases: ["Silhet", "Sylhett"],
    coordinates: { latitude: 24.8949, longitude: 91.8687 }
  },
  {
    name: "Rajshahi",
    type: "city",
    parentLocation: null,
    aliases: ["Rajsahi", "Rajshahee"],
    coordinates: { latitude: 24.3636, longitude: 88.6241 }
  },
  {
    name: "Khulna",
    type: "city",
    parentLocation: null,
    aliases: ["Khulnaa", "Kulna"],
    coordinates: { latitude: 22.8456, longitude: 89.5403 }
  },
  {
    name: "Barisal",
    type: "city",
    parentLocation: null,
    aliases: ["Barishal", "Barishah", "Borishal"],
    coordinates: { latitude: 22.7010, longitude: 90.3535 }
  },
  {
    name: "Rangpur",
    type: "city",
    parentLocation: null,
    aliases: ["Rongpur", "Rangpuur"],
    coordinates: { latitude: 25.7439, longitude: 89.2752 }
  },
  {
    name: "Mymensingh",
    type: "city",
    parentLocation: null,
    aliases: ["Maimansingh", "Mymansingh"],
    coordinates: { latitude: 24.7471, longitude: 90.4203 }
  },
  {
    name: "Comilla",
    type: "city",
    parentLocation: null,
    aliases: ["Cumilla", "Komilla"],
    coordinates: { latitude: 23.4607, longitude: 91.1809 }
  },
  {
    name: "Gazipur",
    type: "city",
    parentLocation: null,
    aliases: ["Gajipur", "Gazipuur"],
    coordinates: { latitude: 23.9999, longitude: 90.4203 }
  },
  {
    name: "Narayanganj",
    type: "city",
    parentLocation: null,
    aliases: ["Narayangonj"],
    coordinates: { latitude: 23.6238, longitude: 90.4990 }
  },
  {
    name: "Cox's Bazar",
    type: "city",
    parentLocation: null,
    aliases: ["Coxs Bazar", "Cox Bazar", "Coxsbazar"],
    coordinates: { latitude: 21.4272, longitude: 91.9497 }
  },
  {
    name: "Jessore",
    type: "city",
    parentLocation: null,
    aliases: ["Jashore", "Jessor"],
    coordinates: { latitude: 23.1697, longitude: 89.2134 }
  },
  {
    name: "Bogura",
    type: "city",
    parentLocation: null,
    aliases: ["Bogra", "Bogurah"],
    coordinates: { latitude: 24.8465, longitude: 89.3772 }
  },
  {
    name: "Dinajpur",
    type: "city",
    parentLocation: null,
    aliases: ["Dinajpuur"],
    coordinates: { latitude: 25.6279, longitude: 88.6332 }
  },
  {
    name: "Kushtia",
    type: "city",
    parentLocation: null,
    aliases: ["Kushthia", "Kushtiya"],
    coordinates: { latitude: 23.9013, longitude: 89.1206 }
  },
  {
    name: "Tangail",
    type: "city",
    parentLocation: null,
    aliases: ["Tangaail"],
    coordinates: { latitude: 24.2513, longitude: 89.9167 }
  },
  {
    name: "Pabna",
    type: "city",
    parentLocation: null,
    aliases: ["Pabana"],
    coordinates: { latitude: 24.0064, longitude: 89.2372 }
  },
  {
    name: "Feni",
    type: "city",
    parentLocation: null,
    aliases: ["Pheni"],
    coordinates: { latitude: 23.0159, longitude: 91.3976 }
  },
  {
    name: "Manikganj",
    type: "city",
    parentLocation: null,
    aliases: ["Manikgonj"],
    coordinates: { latitude: 23.8644, longitude: 90.0047 }
  },
  {
    name: "Savar",
    type: "city",
    parentLocation: null,
    aliases: ["Sabar"],
    coordinates: { latitude: 23.8583, longitude: 90.2700 }
  },
  {
    name: "Patuakhali",
    type: "city",
    parentLocation: null,
    aliases: ["Patuakali"],
    coordinates: { latitude: 22.3596, longitude: 90.3298 }
  },
  {
    name: "Moulvibazar",
    type: "city",
    parentLocation: null,
    aliases: ["Maulvibazar", "Maulvi Bazar"],
    coordinates: { latitude: 24.4829, longitude: 91.7774 }
  },
  {
    name: "Habiganj",
    type: "city",
    parentLocation: null,
    aliases: ["Hobigonj", "Habigonj"],
    coordinates: { latitude: 24.3745, longitude: 91.4156 }
  },
  {
    name: "Thakurgaon",
    type: "city",
    parentLocation: null,
    aliases: ["Thakurgoan"],
    coordinates: { latitude: 26.0336, longitude: 88.4616 }
  },
  {
    name: "Jamalpur",
    type: "city",
    parentLocation: null,
    aliases: ["Jamalpuur"],
    coordinates: { latitude: 24.9375, longitude: 89.9370 }
  },
  {
    name: "Netrokona",
    type: "city",
    parentLocation: null,
    aliases: ["Netrakona", "Netorkona"],
    coordinates: { latitude: 24.8070, longitude: 90.7299 }
  }
];

async function seedLocationData() {
  try {
    // Clear existing data
    await Location.deleteMany({});
    console.log("Cleared existing locations");

    // Insert Bangladesh location data
    await Location.insertMany(bangladeshLocations);
    console.log("Bangladesh locations added successfully!");
    console.log(`Added ${bangladeshLocations.length} locations`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding location data:", error);
    mongoose.connection.close();
  }
}

seedLocationData();
