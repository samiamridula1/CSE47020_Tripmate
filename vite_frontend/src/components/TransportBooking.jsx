import { useState, useEffect } from "react";
import { 
  searchTransport, 
  createBooking, 
  fetchUserBookings, 
  deleteBooking 
} from "../api/transportApi";
import { searchLocations } from "../api/locationApi";
import { getTrips } from "../api/tripApi";

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

  const [selectedTrip, setSelectedTrip] = useState("");
  const [departureSuggestions, setDepartureSuggestions] = useState([]);
  const [arrivalSuggestions, setArrivalSuggestions] = useState([]);
  const [showDepartureSuggestions, setShowDepartureSuggestions] = useState(false);
  const [showArrivalSuggestions, setShowArrivalSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [transports, setTransports] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("search");

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    if (!userId) {
      setError("Please log in first");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      
      const [bookingsRes, tripsRes] = await Promise.all([
        fetchUserBookings(userId),
        getTrips(userId)
      ]);
      
      // Handle API response format
      const bookings = bookingsRes?.data || bookingsRes || [];
      const trips = tripsRes?.data || tripsRes || [];
      
      setTransports(Array.isArray(bookings) ? bookings.filter(b => b.status !== 'cancelled') : []);
      setTrips(Array.isArray(trips) ? trips : []);
      
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchForm({ ...searchForm, [name]: value });

    if (name === 'departureLocation' && value.length >= 2) {
      searchLocationSuggestions(value, 'departure');
    } else if (name === 'arrivalLocation' && value.length >= 2) {
      searchLocationSuggestions(value, 'arrival');
    } else if (name === 'departureLocation') {
      setShowDepartureSuggestions(false);
    } else if (name === 'arrivalLocation') {
      setShowArrivalSuggestions(false);
    }
  };

  const searchLocationSuggestions = async (query, type) => {
    try {
      const suggestions = await searchLocations(query);
      if (type === 'departure') {
        setDepartureSuggestions(suggestions || []);
        setShowDepartureSuggestions(true);
      } else {
        setArrivalSuggestions(suggestions || []);
        setShowArrivalSuggestions(true);
      }
    } catch (err) {
      console.error("Location search error:", err);
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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchForm.departureLocation === searchForm.arrivalLocation) {
      setError("Departure and arrival locations cannot be the same");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const results = await searchTransport(searchForm);
      setSearchResults(results || []);
      if (!results || results.length === 0) {
        setError("No transport found for your search");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (transport) => {
    if (!selectedTrip) {
      setError("Please select a trip first");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const bookingData = {
        transportProviderId: transport._id,
        seats: 1,
        tripId: selectedTrip,
        user: userId,
        date: searchForm.date
      };

      await createBooking(bookingData);
      await loadUserData();
      setActiveTab("bookings");
      setSearchResults([]);
      setSearchForm({ type: "bus", departureLocation: "", arrivalLocation: "", date: "" });
      setSelectedTrip("");
      
    } catch (err) {
      console.error("Booking error:", err);
      setError("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!confirm("Cancel this booking?")) return;

    try {
      await deleteBooking(bookingId);
      await loadUserData();
    } catch (err) {
      console.error("Cancel error:", err);
      setError("Failed to cancel booking");
    }
  };

  const formatPrice = (price) => `৳${price?.toLocaleString('en-BD') || 0}`;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Transport Booking</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 border-b">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("search")}
            className={`py-2 border-b-2 font-medium ${
              activeTab === "search"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500"
            }`}
          >
            Search Transport
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`py-2 border-b-2 font-medium ${
              activeTab === "bookings"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500"
            }`}
          >
            My Bookings ({transports.length})
          </button>
        </nav>
      </div>

      {activeTab === "search" && (
        <div className="space-y-6">
          {/* Search Form */}
          <div className="bg-white p-4 rounded-lg shadow">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <select
                name="type"
                value={searchForm.type}
                onChange={handleInputChange}
                className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="bus">Bus</option>
                <option value="train">Train</option>
                <option value="flight">Flight</option>
                <option value="car">Car</option>
              </select>

              <div className="relative">
                <input
                  name="departureLocation"
                  placeholder="From (e.g., Dhaka)"
                  value={searchForm.departureLocation}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500"
                  required
                />
                {showDepartureSuggestions && departureSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-b-lg max-h-48 overflow-y-auto">
                    {departureSuggestions.map((location) => (
                      <div
                        key={location._id}
                        onClick={() => selectLocation(location, 'departure')}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {location.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <input
                  name="arrivalLocation"
                  placeholder="To (e.g., Cox's Bazar)"
                  value={searchForm.arrivalLocation}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500"
                  required
                />
                {showArrivalSuggestions && arrivalSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-b-lg max-h-48 overflow-y-auto">
                    {arrivalSuggestions.map((location) => (
                      <div
                        key={location._id}
                        onClick={() => selectLocation(location, 'arrival')}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {location.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <input
                name="date"
                type="date"
                value={searchForm.date}
                onChange={handleInputChange}
                className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500"
                min={new Date().toISOString().split('T')[0]}
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white py-3 px-6 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </form>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Available Transport</h3>
              {searchResults.map((transport) => (
                <div key={transport._id} className="bg-white p-4 rounded-lg shadow border">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{transport.provider}</h4>
                      <p className="text-gray-600">
                        {transport.departureLocation} → {transport.arrivalLocation}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {transport.type} • {transport.departureTime} - {transport.arrivalTime}
                      </p>
                      <p className="text-sm text-gray-500">
                        {transport.availableSeats} seats available • {transport.duration}
                      </p>
                      {transport.vehicleInfo && (
                        <p className="text-sm text-gray-500 mt-1">
                          {transport.vehicleInfo.model}
                          {transport.vehicleInfo.features && ` • ${transport.vehicleInfo.features.slice(0, 2).join(", ")}`}
                        </p>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-600">
                        {formatPrice(transport.price)}
                      </p>
                      <p className="text-sm text-gray-500">per person</p>
                      
                      <div className="mt-3 space-y-2">
                        <select
                          value={selectedTrip}
                          onChange={(e) => setSelectedTrip(e.target.value)}
                          className="w-full border border-gray-300 p-2 rounded text-sm"
                          required
                        >
                          <option value="">Select Trip</option>
                          {trips.map((trip) => (
                            <option key={trip._id} value={trip._id}>
                              {trip.destination || 'Unnamed Trip'}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => handleBooking(transport)}
                          disabled={loading || !selectedTrip}
                          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "bookings" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Your Bookings</h3>
          {loading ? (
            <p>Loading...</p>
          ) : transports.length === 0 ? (
            <p className="text-gray-500">No bookings found. Search and book your first transport!</p>
          ) : (
            transports.map((booking) => (
              <div key={booking._id} className="bg-white p-4 rounded-lg shadow border">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{booking.provider || booking.company}</h4>
                    <p className="text-gray-600">
                      {booking.departureLocation} → {booking.arrivalLocation}
                    </p>
                    <div className="text-sm text-gray-500 mt-2 space-y-1">
                      <p>{booking.type} • {new Date(booking.date).toLocaleDateString()}</p>
                      <p>{booking.departureTime} - {booking.arrivalTime}</p>
                      <p>{booking.seats} seat(s) • {booking.duration}</p>
                      {booking.bookingCode && <p>Booking Code: {booking.bookingCode}</p>}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xl font-bold text-blue-600">
                      {formatPrice(booking.totalPrice || booking.price)}
                    </p>
                    <p className="text-sm text-gray-500">total</p>
                    
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        className="mt-2 bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 text-sm"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
