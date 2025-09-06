import React, { useEffect, useState } from "react";
import { 
  getTrips, 
  deleteTrip, 
  updateTripStatus, 
  addTripPhoto, 
  removeTripPhoto 
} from "../api/tripApi";
import TripPhotoGallery from "./TripPhotoGallery";
import { TripStatusBadge, TripStatusFilter, TripStatusStats } from "./TripStatus";
import { TripDuration } from "./TripDuration";
import { useNotification } from "./Notification";

export default function MyTrips({ user }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedTrip, setExpandedTrip] = useState(null);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    const userId = user?._id || user?.id;
    if (userId) {
      fetchTrips(userId);
    }
  }, [user]);

  const fetchTrips = async (userId) => {
    try {
      console.log("Fetching trips for:", userId);
      const data = await getTrips(userId);
      console.log("Trips fetched:", data);
      setTrips(data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await deleteTrip(id);
        const userId = user?._id || user?.id;
        fetchTrips(userId);
        showSuccess("Trip deleted successfully!");
      } catch (error) {
        console.error("Error deleting trip:", error);
        showError("Failed to delete trip. Please try again.");
      }
    }
  };

  const handleStatusChange = async (tripId, newStatus) => {
    try {
      console.log("Updating trip status:", { tripId, newStatus });
      const response = await updateTripStatus(tripId, newStatus);
      console.log("Status update response:", response);
      
      const userId = user?._id || user?.id;
      await fetchTrips(userId);
      showSuccess(`Trip status updated to ${newStatus}!`);
    } catch (err) {
      console.error("Failed to update trip status:", err);
      console.error("Error details:", err.response?.data || err.message);
      showError(`Failed to update trip status: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleAddPhoto = async (tripId, photoData) => {
    try {
      await addTripPhoto(tripId, photoData);
      const userId = user?._id || user?.id;
      fetchTrips(userId);
      showSuccess("Photo added successfully!");
    } catch (err) {
      console.error("Failed to add photo:", err);
      showError("Failed to add photo. Please try again.");
    }
  };

  const handleRemovePhoto = async (tripId, photoIndex) => {
    try {
      await removeTripPhoto(tripId, photoIndex);
      const userId = user?._id || user?.id;
      fetchTrips(userId);
      showSuccess("Photo removed successfully!");
    } catch (err) {
      console.error("Failed to remove photo:", err);
      showError("Failed to remove photo. Please try again.");
    }
  };

  if (!(user?._id || user?.id)) {
    return <p className="text-gray-500">Loading user info...</p>;
  }

  if (loading) {
    return <p className="text-gray-500">Loading trips...</p>;
  }

  // Sort and filter trips
  const sortedTrips = [...trips].sort(
    (a, b) => new Date(b.date || b.startDate) - new Date(a.date || a.startDate)
  );

  const filteredTrips = statusFilter === 'all' 
    ? sortedTrips 
    : sortedTrips.filter(trip => (trip.status || 'planned') === statusFilter);

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-700">My Trips</h1>
        <div className="text-sm text-gray-500">
          {filteredTrips.length} of {trips.length} trips
        </div>
      </div>

      {/* Status Filter */}
      <TripStatusFilter 
        currentFilter={statusFilter} 
        onFilterChange={setStatusFilter} 
      />

      {/* Trip Stats */}
      {trips.length > 0 && (
        <TripStatusStats trips={trips} />
      )}

      {filteredTrips.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {statusFilter === 'all' ? 'No trips found.' : `No ${statusFilter} trips found.`}
          </p>
          <p className="text-gray-400 mt-2">Start planning your next adventure!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTrips.map((trip) => (
            <div
              key={trip._id}
              className="border p-4 rounded-lg shadow-sm bg-white space-y-3"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-bold text-blue-700">
                      {trip.destination}
                    </h3>
                    <TripStatusBadge 
                      status={trip.status || 'planned'} 
                      onStatusChange={handleStatusChange}
                      tripId={trip._id}
                    />
                  </div>
                  
                  {/* Trip Duration */}
                  <div className="mb-2">
                    <TripDuration 
                      startDate={trip.startDate} 
                      endDate={trip.endDate} 
                      date={trip.date}
                      compact={true}
                    />
                  </div>
                  
                  <p className="text-gray-700">{trip.details}</p>
                  
                  {trip.notes && (
                    <div className="mt-2 p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Notes:</span> {trip.notes}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setExpandedTrip(expandedTrip === trip._id ? null : trip._id)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {expandedTrip === trip._id ? 'Hide Photos' : 'Show Photos'}
                  </button>
                  <button
                    onClick={() => handleDelete(trip._id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              {/* Photo Gallery - Expanded View */}
              {expandedTrip === trip._id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <TripPhotoGallery
                    photos={trip.photos || []}
                    onAddPhoto={handleAddPhoto}
                    onRemovePhoto={handleRemovePhoto}
                    tripId={trip._id}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}