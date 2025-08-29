import React, { useEffect, useState } from "react";
import { 
  searchHotels,
  bookHotel, 
  getUserBookings, 
  cancelHotelBooking 
} from "../api/hotelApi";
import { searchLocations } from "../api/locationApi";
import { getTrips } from "../api/tripApi";

export default function HotelBooking({ user }) {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const currentUser = user || storedUser;
  const userId = currentUser?._id || currentUser?.id;

  const [searchForm, setSearchForm] = useState({
    location: "",
    checkInDate: "",
    checkOutDate: "",
    rooms: 1
  });

  const [selectedTrip, setSelectedTrip] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [bookedHotels, setBookedHotels] = useState([]);
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
        getUserBookings(userId),
        getTrips(userId)
      ]);
      
      // Handle API response format
      const bookings = bookingsRes?.data || bookingsRes || [];
      const trips = tripsRes?.data || tripsRes || [];
      
      setBookedHotels(Array.isArray(bookings) ? bookings.filter(b => b.status !== 'cancelled') : []);
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

    if (name === 'location' && value.length >= 2) {
      searchLocationSuggestions(value);
    } else if (name === 'location') {
      setShowSuggestions(false);
    }
  };

  const searchLocationSuggestions = async (query) => {
    try {
      const suggestions = await searchLocations(query);
      setLocationSuggestions(suggestions || []);
      setShowSuggestions(true);
    } catch (err) {
      console.error("Location search error:", err);
    }
  };

  const selectLocation = (location) => {
    setSearchForm({ ...searchForm, location: location.name });
    setShowSuggestions(false);
  };

  const calculateNights = () => {
    if (!searchForm.checkInDate || !searchForm.checkOutDate) return 0;
    const checkIn = new Date(searchForm.checkInDate);
    const checkOut = new Date(searchForm.checkOutDate);
    return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (new Date(searchForm.checkOutDate) <= new Date(searchForm.checkInDate)) {
      setError("Check-out date must be after check-in date");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const results = await searchHotels(searchForm);
      setSearchResults(results || []);
      if (!results || results.length === 0) {
        setError("No hotels found for your search");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (hotel) => {
    if (!selectedTrip) {
      setError("Please select a trip first");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const bookingData = {
        checkInDate: searchForm.checkInDate,
        checkOutDate: searchForm.checkOutDate,
        rooms: parseInt(searchForm.rooms),
        nights: calculateNights(),
        hotelProviderId: hotel._id,
        tripId: selectedTrip,
        user: userId
      };

      await bookHotel(bookingData);
      await loadUserData();
      setActiveTab("bookings");
      setSearchResults([]);
      setSearchForm({ location: "", checkInDate: "", checkOutDate: "", rooms: 1 });
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
      await cancelHotelBooking(bookingId);
      await loadUserData();
    } catch (err) {
      console.error("Cancel error:", err);
      setError("Failed to cancel booking");
    }
  };

  const formatPrice = (price) => `৳${price?.toLocaleString('en-BD') || 0}`;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Hotel Booking</h2>

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
            Search Hotels
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`py-2 border-b-2 font-medium ${
              activeTab === "bookings"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500"
            }`}
          >
            My Bookings ({bookedHotels.length})
          </button>
        </nav>
      </div>

      {activeTab === "search" && (
        <div className="space-y-6">
          {/* Search Form */}
          <div className="bg-white p-4 rounded-lg shadow">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <input
                  name="location"
                  placeholder="City (e.g., Dhaka, Cox's Bazar)"
                  value={searchForm.location}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500"
                  required
                />
                {showSuggestions && locationSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-b-lg max-h-48 overflow-y-auto">
                    {locationSuggestions.map((location) => (
                      <div
                        key={location._id}
                        onClick={() => selectLocation(location)}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {location.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <input
                name="checkInDate"
                type="date"
                value={searchForm.checkInDate}
                onChange={handleInputChange}
                className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500"
                min={new Date().toISOString().split('T')[0]}
                required
              />

              <input
                name="checkOutDate"
                type="date"
                value={searchForm.checkOutDate}
                onChange={handleInputChange}
                className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500"
                min={searchForm.checkInDate || new Date().toISOString().split('T')[0]}
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
              <h3 className="text-lg font-semibold">Available Hotels</h3>
              {searchResults.map((hotel) => (
                <div key={hotel._id} className="bg-white p-4 rounded-lg shadow border">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{hotel.name}</h4>
                      <p className="text-gray-600">{hotel.location} • {hotel.address}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {hotel.roomType} room • {hotel.availableRooms} available
                      </p>
                      {hotel.amenities && (
                        <p className="text-sm text-gray-500 mt-1">
                          {hotel.amenities.slice(0, 3).join(", ")}
                          {hotel.amenities.length > 3 && ` +${hotel.amenities.length - 3} more`}
                        </p>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-600">
                        {formatPrice(hotel.price)}
                      </p>
                      <p className="text-sm text-gray-500">per night</p>
                      {calculateNights() > 0 && (
                        <p className="text-sm font-medium text-green-600">
                          Total: {formatPrice(hotel.price * calculateNights() * searchForm.rooms)}
                        </p>
                      )}
                      
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
                          onClick={() => handleBooking(hotel)}
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
          ) : bookedHotels.length === 0 ? (
            <p className="text-gray-500">No bookings found. Search and book your first hotel!</p>
          ) : (
            bookedHotels.map((booking) => (
              <div key={booking._id} className="bg-white p-4 rounded-lg shadow border">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{booking.hotelName || booking.name || 'Hotel Name Not Available'}</h4>
                    <p className="text-gray-600">{booking.location || 'Location Not Available'}</p>
                    <div className="text-sm text-gray-500 mt-2 space-y-1">
                      <p>Check-in: {booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : 'Date Not Available'}</p>
                      <p>Check-out: {booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString() : 'Date Not Available'}</p>
                      <p>{booking.rooms || 1} room(s) • {booking.nights || 'N/A'} night(s)</p>
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