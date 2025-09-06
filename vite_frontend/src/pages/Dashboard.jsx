import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getTrips,
  createTrip,
  deleteTrip,
  updateTripStatus,
  addTripPhoto,
  removeTripPhoto,
} from "../api/tripApi.js";
import { getAllExperiences, deleteExperience } from "../api/experienceApi.js";
import TripSuggestions from "../components/TripSuggestions.jsx";
import PeopleSuggestions from "../components/PeopleSuggestions";
import ShareExperienceModal from "../components/ShareExperienceModal";
import PackingChecklist from "../components/PackingChecklist";
import ExperienceGrid from "../components/ExperienceGrid";
import TripPhotoGallery from "../components/TripPhotoGallery";
import { TripStatusBadge, TripStatusFilter, TripStatusStats } from "../components/TripStatus";
import { TripDuration, DateRangeInput } from "../components/TripDuration";
import TripTemplates from "../components/TripTemplates";
import { useNotification } from "../components/Notification";


export default function Dashboard({ user }) {
  const { showSuccess, showError } = useNotification();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const currentUser = user || storedUser;

  // Guard clause: Don't render if user is not authenticated
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Please log in to access your dashboard
          </h2>
          <p className="text-gray-500">You need to be authenticated to view this page.</p>
        </div>
      </div>
    );
  }

  const [trips, setTrips] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [form, setForm] = useState({
    destination: "",
    date: "",
    startDate: "",
    endDate: "",
    details: "",
    notes: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedTrip, setExpandedTrip] = useState(null);

  useEffect(() => {
    fetchTrips();
    fetchExperiences();
  }, [currentUser]);

  const fetchTrips = async () => {
    try {
      if (currentUser?._id || currentUser?.id) {
        const tripsData = await getTrips(currentUser._id || currentUser.id);
        setTrips(tripsData);
      }
    } catch (err) {
      console.error("Failed to fetch trips:", err);
      setTrips([]);
    }
  };

  const fetchExperiences = async () => {
    try {
      const data = await getAllExperiences();
      setExperiences(data);
    } catch (err) {
      console.error("Failed to fetch experiences:", err);
      setExperiences([]);
    }
  };

  const refreshExperiences = () => {
    fetchExperiences();
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleTemplateSelect = (template) => {
    const today = new Date();
    const startDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week from now
    const endDate = new Date(startDate.getTime() + (template.suggestedDuration - 1) * 24 * 60 * 60 * 1000);

    setForm({
      ...form,
      details: template.defaultDetails,
      notes: template.defaultNotes,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      date: startDate.toISOString().split('T')[0]
    });
  };

  const handleAddTrip = async (e) => {
    e.preventDefault();
    try {
      const userId = currentUser._id || currentUser.id;
      // Use startDate as main date if provided, otherwise use date field
      const tripData = {
        ...form,
        userId,
        date: form.startDate || form.date, // Backward compatibility
      };
      await createTrip(tripData);
      setForm({ 
        destination: "", 
        date: "", 
        startDate: "", 
        endDate: "", 
        details: "", 
        notes: "" 
      });
      fetchTrips();
      showSuccess("Trip created successfully!");
    } catch (err) {
      console.error("Failed to create trip:", err);
      showError("Failed to create trip. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTrip(id);
      fetchTrips();
      showSuccess("Trip deleted successfully!");
    } catch (err) {
      console.error("Failed to delete trip:", err);
      showError("Failed to delete trip. Please try again.");
    }
  };

  const handleStatusChange = async (tripId, newStatus) => {
    try {
      await updateTripStatus(tripId, newStatus);
      fetchTrips();
      showSuccess(`Trip status updated to ${newStatus}!`);
    } catch (err) {
      console.error("Failed to update trip status:", err);
      showError("Failed to update trip status. Please try again.");
    }
  };

  const handleAddPhoto = async (tripId, photoData) => {
    try {
      await addTripPhoto(tripId, photoData);
      fetchTrips();
      showSuccess("Photo added successfully!");
    } catch (err) {
      console.error("Failed to add photo:", err);
      showError("Failed to add photo. Please try again.");
    }
  };

  const handleRemovePhoto = async (tripId, photoIndex) => {
    try {
      await removeTripPhoto(tripId, photoIndex);
      fetchTrips();
      showSuccess("Photo removed successfully!");
    } catch (err) {
      console.error("Failed to remove photo:", err);
      showError("Failed to remove photo. Please try again.");
    }
  };

  const handleDeleteExperience = async (experienceId) => {
    try {
      const userId = currentUser._id || currentUser.id;
      await deleteExperience(experienceId, userId);
      fetchExperiences(); // Refresh experiences after deletion
      showSuccess("Experience deleted successfully!");
    } catch (err) {
      console.error("Failed to delete experience:", err);
      showError("Failed to delete experience. Please try again.");
    }
  };

  const sortedTrips = [...trips].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Filter trips based on status
  const filteredTrips = statusFilter === 'all' 
    ? sortedTrips 
    : sortedTrips.filter(trip => (trip.status || 'planned') === statusFilter);

  // Sort experiences by createdAt descending (newest first)
  const sortedExperiences = [...experiences].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  // Show all experiences in shared section, but limit to top 3 for dashboard
  const allExperiences = sortedExperiences.slice(0, 3);
  const myExperiences = currentUser
    ? sortedExperiences.filter((exp) => {
        const expUserId = typeof exp.userId === 'object' ? exp.userId?._id : exp.userId;
        const currentUserId = currentUser._id || currentUser.id;
        return expUserId === currentUserId;
      }).slice(0, 3)
    : [];

  return (
    <div className="p-6 space-y-8 max-w-3xl mx-auto">
      <div className="bg-blue-50 p-4 rounded shadow space-y-2">
        <h1 className="text-3xl font-bold text-blue-700">
          Welcome, {currentUser?.name || "Traveler"}!
        </h1>
        <p><strong>Email:</strong> {currentUser?.email}</p>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-white p-3 rounded shadow text-center">
            <div className="text-2xl font-bold text-blue-600">{trips.length}</div>
            <div className="text-sm text-gray-600">Total Trips</div>
          </div>
          <div className="bg-white p-3 rounded shadow text-center">
            <div className="text-2xl font-bold text-orange-600">
              {trips.filter(trip => new Date(trip.date) > new Date()).length}
            </div>
            <div className="text-sm text-gray-600">Upcoming Trips</div>
          </div>
          <div className="bg-white p-3 rounded shadow text-center">
            <div className="text-2xl font-bold text-green-600">{myExperiences.length}</div>
            <div className="text-sm text-gray-600">My Experiences</div>
          </div>
          <div className="bg-white p-3 rounded shadow text-center">
            <div className="text-2xl font-bold text-purple-600">{allExperiences.length}</div>
            <div className="text-sm text-gray-600">Recent Posts</div>
          </div>
        </div>
        
        {sortedTrips.length > 0 && (
          <p className="mt-3">
            <strong>Next Trip Plan:</strong> {sortedTrips[0].destination} on{" "}
            {new Date(sortedTrips[0].date).toLocaleDateString()}
          </p>
        )}
      </div>
      <div className="bg-white p-4 rounded shadow space-y-2">
        <h2 className="text-xl font-semibold text-gray-800">Explore More</h2>
        <div className="flex flex-col gap-2">
          <Link to="/hotel-booking" className="text-blue-600 hover:underline">
            Hotel Booking
          </Link>
          <Link to="/transport-booking" className="text-indigo-600 hover:underline">
            Transport Booking
          </Link>
        </div>
      </div>

      <form
        onSubmit={handleAddTrip}
        className="bg-white p-6 shadow rounded space-y-4"
      >
        <h2 className="text-xl font-semibold text-gray-800">Add a New Trip</h2>
        
        {/* Trip Templates */}
        <div>
          <TripTemplates onSelectTemplate={handleTemplateSelect} />
        </div>

        <input
          name="destination"
          placeholder="Destination"
          value={form.destination}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Trip Dates</h3>
          <DateRangeInput
            startDate={form.startDate}
            endDate={form.endDate}
            onStartDateChange={(date) => setForm({...form, startDate: date, date: date})}
            onEndDateChange={(date) => setForm({...form, endDate: date})}
          />
        </div>

        <textarea
          name="details"
          placeholder="Details"
          value={form.details}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        <textarea
          name="notes"
          placeholder="Personal notes, tips, or reminders (optional)"
          value={form.notes}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          rows="2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Trip
        </button>
      </form>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Your Trips</h2>
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
          <p className="text-gray-500">
            {statusFilter === 'all' ? 'No trips yet. Start planning!' : `No ${statusFilter} trips found.`}
          </p>
        ) : (
          filteredTrips.map((trip) => (
            <div
              key={trip._id}
              className="border p-4 rounded shadow space-y-3"
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
                    className="text-red-600 hover:underline"
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
          ))
        )}
      </div>

      {/* Packing Checklist */}
      <div className="bg-white p-6 shadow rounded space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Packing Checklist</h2>
        <PackingChecklist />
      </div>

      {/* Unified Experiences Grid */}
      <ExperienceGrid
        title="My Experiences"
        experiences={myExperiences}
        currentUserId={currentUser._id || currentUser.id}
        onDelete={handleDeleteExperience}
        showDelete={true}
        showOwner={false}
        emptyText="You haven't added any experiences yet."
        actions={
          <>
            <button
              onClick={() => setShowModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm ml-2"
            >
              Share Experience
            </button>
            <Link to="/my-experiences" className="text-blue-600 hover:underline text-sm">View All →</Link>
            {showModal && (
              <ShareExperienceModal
                userId={currentUser._id}
                onClose={() => setShowModal(false)}
                onUploadSuccess={refreshExperiences}
              />
            )}
          </>
        }
        gridCols="md:grid-cols-2 lg:grid-cols-3"
      />
      <ExperienceGrid
        title="Recent Trip Experiences"
        experiences={allExperiences}
        currentUserId={currentUser._id || currentUser.id}
        onDelete={handleDeleteExperience}
        showDelete={true}
        showOwner={true}
        emptyText="No experiences shared yet."
        actions={
          <Link to="/all-experiences" className="text-blue-600 hover:underline text-sm">View All →</Link>
        }
        gridCols="md:grid-cols-2 lg:grid-cols-3"
      />

      <TripSuggestions />

      <PeopleSuggestions />
    </div>
  );
}