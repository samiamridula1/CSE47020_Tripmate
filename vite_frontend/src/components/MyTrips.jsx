import React, { useEffect, useState } from "react";
import { getTrips, deleteTrip } from "../api/tripApi";

export default function MyTrips({ user }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = user?._id || user?.id;
    if (userId) {
      fetchTrips(userId);
    }
  }, [user]);

  const fetchTrips = async (userId) => {
    try {
      console.log("🔗 Fetching trips for:", userId);
      const data = await getTrips(userId);
      console.log("📦 Trips fetched:", data);
      setTrips(data);
    } catch (error) {
      console.error("❌ Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTrip(id);
      fetchTrips();
    } catch (error) {
      console.error("❌ Error deleting trip:", error);
    }
  };

  if (!(user?._id || user?.id)) {
    return <p className="text-gray-500">Loading user info...</p>;
  }

  if (loading) {
    return <p className="text-gray-500">Loading trips...</p>;
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-700">My Trips</h1>

      {trips.length === 0 ? (
        <p className="text-gray-500">No trips found.</p>
      ) : (
        trips.map((trip) => (
          <div
            key={trip._id}
            className="border p-4 rounded shadow flex justify-between items-start"
          >
            <div>
              <h3 className="text-lg font-bold text-blue-700">
                {trip.destination}
              </h3>
              <p className="text-sm text-gray-600">
                {new Date(trip.date).toLocaleDateString()}
              </p>
              <p className="text-gray-700">{trip.details}</p>
            </div>
            <button
              onClick={() => handleDelete(trip._id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}