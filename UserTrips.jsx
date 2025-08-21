import React, { useEffect, useState } from "react";
import axios from "axios";

function UserTrips({ userId, refreshTrigger }) {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/trips/${userId}`);
        setTrips(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTrips();
  }, [userId, refreshTrigger]);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">Your Trips</h2>
      {trips.length === 0 ? (
        <p>No trips added yet.</p>
      ) : (
        <ul className="space-y-2">
          {trips.map((trip) => (
            <li key={trip._id} className="border p-3 rounded">
              <strong>Destination:</strong> {trip.destination} <br />
              <strong>Date:</strong> {new Date(trip.date).toLocaleDateString()} <br />
              <strong>Details:</strong> {trip.details || "N/A"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserTrips;
