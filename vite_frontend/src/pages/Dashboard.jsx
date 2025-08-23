import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getTrips,
  createTrip,
  deleteTrip,
} from "../api/tripApi.js";
import { getAllExperiences, deleteExperience } from "../api/experienceApi.js";
import { fetchHotels } from "../api/hotelApi.js";
import TripSuggestions from "../components/TripSuggestions.jsx";
import PeopleSuggestions from "../components/PeopleSuggestions";
import ShareExperienceModal from "../components/ShareExperienceModal";
import PackingChecklist from "../components/PackingChecklist";
import ExperienceGrid from "../components/ExperienceGrid";

export default function Dashboard({ user }) {
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
  const [hotels, setHotels] = useState([]);
  const [form, setForm] = useState({
    destination: "",
    date: "",
    details: "",
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTrips();
    fetchExperiences();
    fetchHotelData();
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

  const fetchHotelData = async () => {
    try {
      const response = await fetchHotels();
      setHotels(response.data || []);
    } catch (err) {
      console.error("Failed to fetch hotels:", err);
      setHotels([]);
    }
  };

  const refreshExperiences = () => {
    fetchExperiences();
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddTrip = async (e) => {
    e.preventDefault();
    try {
      const userId = currentUser._id || currentUser.id;
      await createTrip({ ...form, userId });
      setForm({ destination: "", date: "", details: "" });
      fetchTrips();
    } catch (err) {
      console.error("Failed to create trip:", err);
      alert("Failed to create trip. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTrip(id);
      fetchTrips();
    } catch (err) {
      console.error("Failed to delete trip:", err);
      alert("Failed to delete trip. Please try again.");
    }
  };

  const handleDeleteExperience = async (experienceId) => {
    try {
      const userId = currentUser._id || currentUser.id;
      await deleteExperience(experienceId, userId);
      fetchExperiences(); // Refresh experiences after deletion
    } catch (err) {
      console.error("Failed to delete experience:", err);
      alert("Failed to delete experience. Please try again.");
    }
  };

  const sortedTrips = [...trips].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

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
        <p><strong>Total Trips:</strong> {trips.length}</p>
        {sortedTrips.length > 0 && (
          <p>
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
        <input
          name="destination"
          placeholder="Destination"
          value={form.destination}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
        <textarea
          name="details"
          placeholder="Details"
          value={form.details}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Trip
        </button>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Your Trips</h2>
        {sortedTrips.length === 0 ? (
          <p className="text-gray-500">No trips yet. Start planning!</p>
        ) : (
          sortedTrips.map((trip) => (
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