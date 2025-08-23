import React from "react";

const suggestions = [
  {
    id: 1,
    destination: "Cox's Bazar",
    reason: "Perfect for beach lovers",
    image: "https://wallpapercave.com/wp/wp10812187.jpg",
    category: "Beach"
  },
  {
    id: 2,
    destination: "Sajek Valley",
    reason: "Ideal for mountain views",
    image: "https://i.pinimg.com/originals/50/10/4a/50104a5ba9bea452159dc69c656a64cf.jpg",
    category: "Mountain"
  },
  {
    id: 3,
    destination: "Sylhet",
    reason: "Tea gardens and waterfalls",
    image: "https://static2.tripoto.com/media/filter/tst/img/2167124/TripDocument/1641531511_96bbe4dac52afa9e9616fb4f2a6dc1c9.png",
    category: "Nature"
  },
  {
    id: 4,
    destination: "Rangamati",
    reason: "Peaceful lake views and hill serenity",
    image: "https://th.bing.com/th/id/R.cc4a8b86aebe036a455f390189832385?rik=0JaAtQP2sdNKgQ&pid=ImgRaw&r=0&sres=1&sresct=1",
    category: "Lake"
  },
  {
    id: 5,
    destination: "Bandarban",
    reason: "Waterfalls and mountain adventures",
    image: "https://i.redd.it/f0858h7noih41.jpg",
    category: "Adventure"
  },
  {
    id: 6,
    destination: "Sundarbans",
    reason: "Mangrove forests and wildlife",
    image: "https://ecdn.dhakatribune.net/contents/cache/images/640x359x1/uploads/media/2023/08/11/Sundarbans-Deer-Chitra-Deer-d4706be88bfa5ba7a3e01503f5320885.jpg",
    category: "Wildlife"
  },
];

const TripSuggestions = () => {
  return (
    <div className="bg-white p-6 shadow rounded space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          TripMate Suggestions
        </h2>
        <p className="text-gray-600">
          Discover amazing destinations handpicked for your next adventure
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suggestions.map((trip) => (
          <div
            key={trip.id}
            className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={trip.image}
                alt={`Scenery of ${trip.destination}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3">
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  {trip.category}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                {trip.destination}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {trip.reason}
              </p>
              
              <div className="mt-4 flex items-center justify-between">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Learn More
                </button>
                <div className="flex items-center text-yellow-500">
                  <span className="text-sm">★★★★☆</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center pt-4">
        <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg">
          View All Destinations
        </button>
      </div>
    </div>
  );
};

export default TripSuggestions;