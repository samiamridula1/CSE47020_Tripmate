import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchHotels } from '../api/hotelApi';

const HotelSection = () => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    fetchHotels()
      .then(res => setHotels(res.data))
      .catch(err => console.error('Hotel fetch error:', err));
  }, []);

  return (
    <div className="dashboard-box">
      <h2>Recommended Hotels</h2>
      <ul className="space-y-4">
        {hotels.map(hotel => (
          <li key={hotel._id} className="border p-4 rounded shadow">
            <strong className="text-lg text-blue-700">{hotel.name}</strong> — {hotel.location}
            <p className="text-sm text-gray-600">Price: ₹ {hotel.price}</p>
            <Link
              to="/hotel-booking"
              state={{ hotel }}
              className="inline-block mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Book Now
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HotelSection;