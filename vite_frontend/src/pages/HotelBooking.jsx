import React, { useEffect, useState } from "react";
import { 
  searchHotels,
  bookHotel, 
  getUserBookings, 
  cancelHotelBooking 
} from "../api/hotelApi";
import { searchLocations } from "../api/locationApi";
import { fetchTrips } from "../api/tripApi";

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

  const [bookingForm, setBookingForm] = useState({
    tripId: ""
  });

  // Location suggestions state
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  const [searchResults, setSearchResults] = useState([]);
  const [bookedHotels, setBookedHotels] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("search"); // "search" or "bookings"

  const roomTypeIcons = {
    single: "🛏️",
    double: "🛏️🛏️",
    suite: "🏨",
    family: "👨‍👩‍👧‍👦",
    deluxe: "⭐"
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    if (!userId) {
      setError("Please log in to view hotel bookings");
      return;
    }
    
    try {
      setLoading(true);
      console.log("Fetching data for userId:", userId);
      const [hotelData, tripData] = await Promise.all([
        getUserBookings(userId),
        fetchTrips(userId)
      ]);
      console.log("Hotel data:", hotelData);
      console.log("Trip data:", tripData);
      setBookedHotels(hotelData.filter(booking => booking.status !== 'cancelled'));
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
    if (name === 'location') {
      if (value.length >= 2) {
        searchLocationSuggestions(value);
      } else {
        setLocationSuggestions([]);
        setShowLocationSuggestions(false);
      }
    }
  };

  const searchLocationSuggestions = async (query) => {
    try {
      const suggestions = await searchLocations(query);
      setLocationSuggestions(suggestions);
      setShowLocationSuggestions(true);
    } catch (err) {
      console.error("Error fetching location suggestions:", err);
    }
  };

  const selectLocation = (location) => {
    setSearchForm({ ...searchForm, location: location.name });
    setShowLocationSuggestions(false);
  };

  const handleBookingChange = (e) => {
    setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
  };

  const calculateNights = (checkIn, checkOut) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchLoading(true);
    setError("");
    setSearchResults([]);

    if (new Date(searchForm.checkOutDate) <= new Date(searchForm.checkInDate)) {
      setError("Check-out date must be after check-in date");
      setSearchLoading(false);
      return;
    }

    try {
      const results = await searchHotels(searchForm);
      setSearchResults(results);
      if (results.length === 0) {
        setError("No hotels found for your search criteria");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search hotels");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleBook = async (hotel) => {
    if (!bookingForm.tripId) {
      setError("Please select a trip");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const nights = calculateNights(searchForm.checkInDate, searchForm.checkOutDate);
      const bookingData = {
        checkInDate: searchForm.checkInDate,
        checkOutDate: searchForm.checkOutDate,
        rooms: parseInt(searchForm.rooms),
        nights: nights,
        hotelProviderId: hotel._id,
        tripId: bookingForm.tripId,
        user: userId
      };

      await bookHotel(bookingData);
      await fetchData();
      setActiveTab("bookings");
      setSearchResults([]);
      setSearchForm({
        location: "",
        checkInDate: "",
        checkOutDate: "",
        rooms: 1
      });
      setBookingForm({
        tripId: ""
      });
    } catch (err) {
      console.error("Booking error:", err);
      setError("Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this hotel booking?")) {
      return;
    }

    try {
      await cancelHotelBooking(id);
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
        <span role="img" aria-label="hotel">🏨</span>
        Hotel Booking
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Debug Info - Remove this later */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded mb-4 text-sm">
          <strong>Debug Info:</strong> User ID: {userId}, Trips: {trips.length}, 
          {trips.length > 0 && ` First trip: ${trips[0]?.destination || 'No destination'}`}
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
            My Bookings ({bookedHotels.length})
          </button>
        </nav>
      </div>

      {activeTab === "search" && (
        <div className="space-y-6">
          {/* Search Form */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Search Hotels</h3>
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                💡 <strong>Tip:</strong> Start typing city names like "Dhaka", "Cox's Bazar", "Sylhet" for location suggestions
              </p>
            </div>
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <input
                  name="location"
                  placeholder="Destination City"
                  value={searchForm.location}
                  onChange={handleSearchChange}
                  onFocus={() => searchForm.location.length >= 2 && setShowLocationSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                {showLocationSuggestions && locationSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
                    {locationSuggestions.map((location) => (
                      <div
                        key={location._id}
                        onClick={() => selectLocation(location)}
                        className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium">{location.name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <input
                name="checkInDate"
                type="date"
                placeholder="Check-in Date"
                value={searchForm.checkInDate}
                onChange={handleSearchChange}
                className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                min={new Date().toISOString().split('T')[0]}
                required
              />

              <input
                name="checkOutDate"
                type="date"
                placeholder="Check-out Date"
                value={searchForm.checkOutDate}
                onChange={handleSearchChange}
                className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                min={searchForm.checkInDate || new Date().toISOString().split('T')[0]}
                required
              />

              <select
                name="rooms"
                value={searchForm.rooms}
                onChange={handleSearchChange}
                className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>
                    {num} Room{num > 1 ? 's' : ''}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                disabled={searchLoading}
                className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {searchLoading ? "Searching..." : "Search Hotels"}
              </button>
            </form>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Available Hotels</h3>
              <div className="space-y-4">
                {searchResults.map((hotel) => (
                  <div key={hotel._id} className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">🏨</span>
                          <div>
                            <h4 className="font-semibold text-lg">{hotel.name}</h4>
                            <p className="text-sm text-gray-600">{hotel.location}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-yellow-500">{'★'.repeat(hotel.rating)}</span>
                              <span className="text-gray-400">{'★'.repeat(5 - hotel.rating)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Address</p>
                            <p className="font-medium">{hotel.address}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Room Type</p>
                            <p className="font-medium">
                              {roomTypeIcons[hotel.roomType]} {hotel.roomType.charAt(0).toUpperCase() + hotel.roomType.slice(1)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Available Rooms</p>
                            <p className="font-medium">{hotel.availableRooms} / {hotel.totalRooms}</p>
                          </div>
                        </div>

                        {hotel.amenities && hotel.amenities.length > 0 && (
                          <div className="mt-2">
                            <p className="text-gray-600 text-sm">Amenities:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {hotel.amenities.map((amenity, idx) => (
                                <span key={idx} className="bg-gray-100 text-xs px-2 py-1 rounded">
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {hotel.description && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-700">{hotel.description}</p>
                          </div>
                        )}
                      </div>

                      <div className="ml-6 text-right">
                        <p className="text-2xl font-bold text-blue-600">
                          {formatPrice(hotel.price, hotel.currency)}
                        </p>
                        <p className="text-sm text-gray-600">per night</p>
                        
                        {searchForm.checkInDate && searchForm.checkOutDate && (
                          <div className="mt-2 text-sm">
                            <p className="text-gray-600">
                              {calculateNights(searchForm.checkInDate, searchForm.checkOutDate)} nights
                            </p>
                            <p className="font-semibold text-green-600">
                              Total: {formatPrice(hotel.price * calculateNights(searchForm.checkInDate, searchForm.checkOutDate) * searchForm.rooms, hotel.currency)}
                            </p>
                          </div>
                        )}
                        
                        <div className="mt-4 space-y-2">
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
                            onClick={() => handleBook(hotel)}
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
          <h3 className="text-xl font-semibold mb-4">Your Hotel Bookings</h3>
          {loading ? (
            <p>Loading bookings...</p>
          ) : bookedHotels.length === 0 ? (
            <p className="text-gray-600">No hotel bookings found. Search and book your first hotel!</p>
          ) : (
            <div className="space-y-4">
              {bookedHotels.map((booking) => (
                <div key={booking._id} className="border border-gray-200 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">🏨</span>
                        <div>
                          <h4 className="font-semibold text-lg">{booking.hotelName}</h4>
                          <p className="text-sm text-gray-600">{booking.location}</p>
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
                          <p className="text-gray-600">Check-in / Check-out</p>
                          <p className="font-medium">{new Date(booking.checkInDate).toLocaleDateString()}</p>
                          <p className="font-medium">{new Date(booking.checkOutDate).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-500">{booking.nights} nights</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Room Details</p>
                          <p className="font-medium">{booking.rooms} room{booking.rooms > 1 ? 's' : ''}</p>
                          <p className="text-xs text-gray-500">{booking.roomType}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Booking Details</p>
                          <p className="font-medium">Code: {booking.bookingCode || "N/A"}</p>
                          <p className="text-xs text-gray-500">Address: {booking.address}</p>
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
                        {formatPrice(booking.totalPrice || booking.price || 0, booking.currency)}
                      </p>
                      <p className="text-sm text-gray-600">total price</p>
                      
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