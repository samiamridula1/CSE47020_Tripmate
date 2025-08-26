import { useState, useEffect } from "react";
import { createBooking, fetchUserBookings, updateBooking, deleteBooking } from "../api/transportApi";
import { fetchTrips } from "../api/tripApi";

export default function TransportBooking({ user }) {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const currentUser = user || storedUser;
  const userId = currentUser?._id || currentUser?.id;

  const [form, setForm] = useState({
    type: "flight",
    provider: "",
    bookingCode: "",
    departureLocation: "",
    arrivalLocation: "",
    date: "",
    tripId: "",
    user: userId
  });

  const [transports, setTransports] = useState([]);
  const [trips, setTrips] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const typeColor = {
    flight: "text-blue-600",
    train: "text-green-600",
    car: "text-yellow-600"
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    if (!userId) {
      setError("Please log in to view transport bookings");
      return;
    }
    
    try {
      setLoading(true);
      const [transportData, tripData] = await Promise.all([
        fetchUserBookings(userId),
        fetchTrips(userId)
      ]);
      setTransports(transportData);
      setTrips(tripData);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (t) => {
    setForm({
      type: t.type,
      provider: t.provider,
      bookingCode: t.bookingCode,
      departureLocation: t.departureLocation,
      arrivalLocation: t.arrivalLocation,
      date: t.date?.slice(0, 10) || "",
      tripId: t.tripId || "",
      user: userId
    });
    setEditingId(t._id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteBooking(id);
      await fetchData();
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete booking");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = { ...form };

      if (editingId) {
        await updateBooking(editingId, payload);
        setEditingId(null);
      } else {
        await createBooking(payload);
      }

      setForm({
        type: "flight",
        provider: "",
        bookingCode: "",
        departureLocation: "",
        arrivalLocation: "",
        date: "",
        tripId: "",
        user: userId
      });

      await fetchData();
    } catch (err) {
      console.error("Submit error:", err);
      setError("Failed to save booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <span role="img" aria-label="transport">🧭</span>
        Transport Booking Info
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="flight">Flight</option>
          <option value="train">Train</option>
          <option value="car">Car Rental</option>
        </select>

        <input
          name="provider"
          placeholder="Provider"
          value={form.provider}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="bookingCode"
          placeholder="Booking Code"
          value={form.bookingCode}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="departureLocation"
          placeholder="Departure Location"
          value={form.departureLocation}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="arrivalLocation"
          placeholder="Arrival Location"
          value={form.arrivalLocation}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <select
          name="tripId"
          value={form.tripId}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Trip</option>
          {trips.map((trip) => (
            <option key={trip._id} value={trip._id}>
              {trip.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {editingId ? "Update Booking" : "Add Booking"}
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-2">Your Transport Bookings</h3>
      <div className="space-y-4">
        {transports.map((t) => (
          <div key={t._id} className="border p-4 rounded shadow">
            <p className={`${typeColor[t.type]} font-semibold`}>
              Type: {t.type}
            </p>
            <p>Provider: {t.provider}</p>
            <p>From: {t.departureLocation} → {t.arrivalLocation}</p>
            <p>Date: {t.date?.slice(0, 10)}</p>
            <p>Booking Code: {t.bookingCode || "N/A"}</p>
            <p>
              Trip:{" "}
              {trips.find((trip) => trip._id === t.tripId)?.name || "Unlinked"}
            </p>
            <div className="mt-2 flex gap-4">
              <button
                onClick={() => handleEdit(t)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(t._id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}