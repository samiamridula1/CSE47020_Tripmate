import { useState, useEffect } from "react";
import { 
  searchTransport, 
  createBooking, 
  fetchUserBookings, 
  updateBooking, 
  deleteBooking 
} from "../api/transportApi";
import { searchLocations } from "../api/locationApi";
import { fetchTrips } from "../api/tripApi";

export default function TransportBooking({ user }) {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const currentUser = user || storedUser;
  const userId = currentUser?._id || currentUser?.id;

  const [searchForm, setSearchForm] = useState({
    type: "bus",
    departureLocation: "",
    arrivalLocation: "",
    date: ""
  });

  const [bookingForm, setBookingForm] = useState({
    tripId: "",
    seats: 1
  });

  // Location suggestions state
  const [departureSuggestions, setDepartureSuggestions] = useState([]);
  const [arrivalSuggestions, setArrivalSuggestions] = useState([]);
  const [showDepartureSuggestions, setShowDepartureSuggestions] = useState(false);
  const [showArrivalSuggestions, setShowArrivalSuggestions] = useState(false);

  const [searchResults, setSearchResults] = useState([]);
  const [transports, setTransports] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("search"); // "search" or "bookings"

  const typeColor = {
    flight: "text-blue-600",
    train: "text-green-600",
    bus: "text-purple-600",
    car: "text-yellow-600"
  };

  const typeIcon = {
    flight: "✈️",
    train: "🚆",
    bus: "🚌",
    car: "🚗"
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    if (!userId) {
      setError("Please log in to view transport bookings");
      return;
    }
    
    try {
      setLoading(true);
      console.log("Fetching data for userId:", userId);
      const [transportData, tripData] = await Promise.all([
        fetchUserBookings(userId),
        fetchTrips(userId)
      ]);
      console.log("Transport data:", transportData);
      console.log("Trip data:", tripData);
      setTransports(transportData.filter(booking => booking.status !== 'cancelled'));
      setTrips(tripData);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchForm({ ...searchForm, [name]: value });

    // Handle location suggestions
    if (name === 'departureLocation') {
      if (value.length >= 2) {
        searchLocationSuggestions(value, 'departure');
      } else {
        setDepartureSuggestions([]);
        setShowDepartureSuggestions(false);
      }
    } else if (name === 'arrivalLocation') {
      if (value.length >= 2) {
        searchLocationSuggestions(value, 'arrival');
      } else {
        setArrivalSuggestions([]);
        setShowArrivalSuggestions(false);
      }
    }
  };

  const searchLocationSuggestions = async (query, type) => {
    try {
      const suggestions = await searchLocations(query);
      if (type === 'departure') {
        setDepartureSuggestions(suggestions);
        setShowDepartureSuggestions(true);
      } else {
        setArrivalSuggestions(suggestions);
        setShowArrivalSuggestions(true);
      }
    } catch (err) {
      console.error("Error fetching location suggestions:", err);
    }
  };

  const selectLocation = (location, type) => {
    if (type === 'departure') {
      setSearchForm({ ...searchForm, departureLocation: location.name });
      setShowDepartureSuggestions(false);
    } else {
      setSearchForm({ ...searchForm, arrivalLocation: location.name });
      setShowArrivalSuggestions(false);
    }
  };

  const handleBookingChange = (e) => {
    setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchLoading(true);
    setError("");
    setSearchResults([]);

    try {
      const results = await searchTransport(searchForm);
      setSearchResults(results);
      if (results.length === 0) {
        setError("No transport options found for your search criteria");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search transport options");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleBook = async (provider) => {
    if (!bookingForm.tripId) {
      setError("Please select a trip");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const bookingData = {
        type: provider.type,
        departureLocation: provider.departureLocation,
        arrivalLocation: provider.arrivalLocation,
        date: searchForm.date,
        transportProviderId: provider._id,
        seats: parseInt(bookingForm.seats),
        tripId: bookingForm.tripId,
        user: userId
      };

      await createBooking(bookingData);
      await fetchData();
      setActiveTab("bookings");
      setSearchResults([]);
      setSearchForm({
        type: "bus",
        departureLocation: "",
        arrivalLocation: "",
        date: ""
      });
      setBookingForm({
        tripId: "",
        seats: 1
      });
    } catch (err) {
      console.error("Booking error:", err);
      setError("Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      await deleteBooking(id);
      await fetchData();
    } catch (err) {
      console.error("Cancel error:", err);
      setError("Failed to cancel booking");
    }
  };

  const formatPrice = (price, currency = "BDT") => {
    if (currency === "BDT") {
      return `৳${price.toLocaleString('en-BD')}`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
        Transport Booking
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("search")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "search"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Search & Book
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "bookings"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            My Bookings ({transports.length})
          </button>
        </nav>
      </div>

      {activeTab === "search" && (
        <div className="space-y-6">
          {/* Search Form */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Search Transport Options</h3>
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                💡 <strong>Tip:</strong> Start typing city names like "Dhaka", "Chittagong", "Sylhet" for location suggestions
              </p>
            </div>
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <select
                name="type"
                value={searchForm.type}
                onChange={handleSearchChange}
                className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="bus">🚌 Bus</option>
                <option value="train">🚆 Train</option>
                <option value="flight">✈️ Flight</option>
                <option value="car">🚗 Car Rental</option>
              </select>

              <div className="relative">
                <input
                  name="departureLocation"
                  placeholder="From (City)"
                  value={searchForm.departureLocation}
                  onChange={handleSearchChange}
                  onFocus={() => searchForm.departureLocation.length >= 2 && setShowDepartureSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowDepartureSuggestions(false), 200)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                {showDepartureSuggestions && departureSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
                    {departureSuggestions.map((location) => (
                      <div
                        key={location._id}
                        onClick={() => selectLocation(location, 'departure')}
                        className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium">{location.name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <input
                  name="arrivalLocation"
                  placeholder="To (City)"
                  value={searchForm.arrivalLocation}
                  onChange={handleSearchChange}
                  onFocus={() => searchForm.arrivalLocation.length >= 2 && setShowArrivalSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowArrivalSuggestions(false), 200)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                {showArrivalSuggestions && arrivalSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
                    {arrivalSuggestions.map((location) => (
                      <div
                        key={location._id}
                        onClick={() => selectLocation(location, 'arrival')}
                        className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium">{location.name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <input
                name="date"
                type="date"
                value={searchForm.date}
                onChange={handleSearchChange}
                className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                min={new Date().toISOString().split('T')[0]}
                required
              />

              <button
                type="submit"
                disabled={searchLoading}
                className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {searchLoading ? "Searching..." : "Search"}
              </button>
            </form>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Available Options</h3>
              <div className="space-y-4">
                {searchResults.map((option) => (
                  <div key={option._id} className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{typeIcon[option.type]}</span>
                          <div>
                            <h4 className="font-semibold text-lg">{option.provider}</h4>
                            <p className={`text-sm ${typeColor[option.type]}`}>
                              {option.type.charAt(0).toUpperCase() + option.type.slice(1)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Route</p>
                            <p className="font-medium">{option.departureLocation} → {option.arrivalLocation}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Time</p>
                            <p className="font-medium">{option.departureTime} - {option.arrivalTime}</p>
                            <p className="text-xs text-gray-500">Duration: {option.duration}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Available Seats</p>
                            <p className="font-medium">{option.availableSeats} / {option.totalSeats}</p>
                          </div>
                        </div>

                        {option.vehicleInfo?.features && (
                          <div className="mt-2">
                            <p className="text-gray-600 text-sm">Features:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {option.vehicleInfo.features.map((feature, idx) => (
                                <span key={idx} className="bg-gray-100 text-xs px-2 py-1 rounded">
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="ml-6 text-right">
                        <p className="text-2xl font-bold text-blue-600">
                          {formatPrice(option.price, option.currency)}
                        </p>
                        <p className="text-sm text-gray-600">per person</p>
                        
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2">
                            <select
                              name="seats"
                              value={bookingForm.seats}
                              onChange={handleBookingChange}
                              className="border border-gray-300 p-2 rounded text-sm"
                              max={option.availableSeats}
                            >
                              {[...Array(Math.min(option.availableSeats, 10))].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                  {i + 1} seat{i > 0 ? 's' : ''}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <select
                            name="tripId"
                            value={bookingForm.tripId}
                            onChange={handleBookingChange}
                            className="w-full border border-gray-300 p-2 rounded text-sm"
                            required
                          >
                            <option value="">Select Trip</option>
                            {trips.length === 0 ? (
                              <option value="" disabled>No trips found - Create a trip first</option>
                            ) : (
                              trips.map((trip) => (
                                <option key={trip._id} value={trip._id}>
                                  {trip.destination || 'Unnamed Trip'} - {trip.date ? new Date(trip.date).toLocaleDateString() : 'No date'}
                                </option>
                              ))
                            )}
                          </select>

                          <button
                            onClick={() => handleBook(option)}
                            disabled={loading || !bookingForm.tripId}
                            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50 font-medium text-sm"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "bookings" && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Your Transport Bookings</h3>
          {loading ? (
            <p>Loading bookings...</p>
          ) : transports.length === 0 ? (
            <p className="text-gray-600">No bookings found. Search and book your first transport!</p>
          ) : (
            <div className="space-y-4">
              {transports.map((booking) => (
                <div key={booking._id} className="border border-gray-200 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{typeIcon[booking.type]}</span>
                        <div>
                          <h4 className="font-semibold text-lg">{booking.provider}</h4>
                          <p className={`text-sm ${typeColor[booking.type]}`}>
                            {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Route</p>
                          <p className="font-medium">{booking.departureLocation} → {booking.arrivalLocation}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Date & Time</p>
                          <p className="font-medium">{new Date(booking.date).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-500">{booking.departureTime} - {booking.arrivalTime}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Booking Details</p>
                          <p className="font-medium">Code: {booking.bookingCode || "N/A"}</p>
                          <p className="text-xs text-gray-500">Seats: {booking.seats || 1}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Trip</p>
                          <p className="font-medium">
                            {trips.find((trip) => trip._id === booking.tripId)?.destination || "Unlinked"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="ml-6 text-right">
                      <p className="text-xl font-bold text-blue-600">
                        {formatPrice(booking.price || 0, booking.currency)}
                      </p>
                      
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleCancel(booking._id)}
                          className="mt-2 bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 text-sm"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}