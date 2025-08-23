import React, { useEffect, useState } from "react";
import { bookHotel, getUserBookings } from "../api/hotelApi";

export default function HotelBooking({ user }) {
  const [bookedHotels, setBookedHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const currentUser = user || storedUser;
  const userId = currentUser?._id || currentUser?.id;

  const availableHotels = [
    {
      name: "Ocean View Resort",
      address: "Cox's Bazar",
      price: 1200,
      image: "/images/ocean-view.jpg",
      
    },
    {
      name: "Mountain Escape",
      address: "Bandarban",
      price: 3000,
      image: "/images/mountain-escape.jpg",
    },
    {
      name: "City Comfort Inn",
      address: "Dhaka",
      price: 7000,
      image: "/images/city-comfort.jpg",
    },
  ];

  useEffect(() => {
    if (!userId) return;
    async function fetchHotels() {
      try {
        const res = await getUserBookings(userId);
        setBookedHotels(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching hotels:", err);
        setBookedHotels([]);
      }
    }
    fetchHotels();
  }, [userId]);

  async function handleBook(hotel) {
    if (!userId) {
      alert("Please log in to book hotels");
      return;
    }
    
    try {
      setLoading(true);
      const res = await bookHotel({
        ...hotel,
        userId,
      });
      setBookedHotels((prev) => [...prev, res.data]);
      alert("Hotel booked successfully!");
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Hotel Booking Options</h2>

      <h3 className="text-xl font-semibold mb-4">Available Hotels</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {availableHotels.map((hotel, index) => (
          <div key={index} className="border rounded-lg shadow overflow-hidden">
            <img
              src={hotel.image}
              alt={hotel.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h4 className="text-lg font-bold">{hotel.name}</h4>
              <p className="text-sm text-gray-600">{hotel.address}</p>
              <p className="mt-2 text-md font-medium">💰 ৳{hotel.price}</p>
              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                onClick={() => handleBook(hotel)}
                disabled={loading}
              >
                {loading ? "Booking..." : "Book Now"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-semibold mb-4">Your Bookings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookedHotels.length === 0 ? (
          <p className="text-gray-500">No hotel bookings found.</p>
        ) : (
          bookedHotels.map((hotel) => (
            <div key={hotel._id} className="border rounded-lg shadow p-4">
              <h4 className="text-lg font-bold">{hotel.name}</h4>
              <p className="text-sm text-gray-600">{hotel.address}</p>
              <p className="mt-2 text-md font-medium">Price: ৳{hotel.price}</p>
              <p className="mt-1 text-sm">Confirmation: {hotel.confirmation || "Pending"}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}