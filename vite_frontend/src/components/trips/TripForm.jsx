import React, { useState } from "react";
// import axios from "axios";

function TripForm({ userId, onTripAdded }) {
    const [destination, setDestination] = useState("");
    const [date, setDate] = useState("");
    const [details, setDetails] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Adding trip:", { userId, destination, date, details });

            setDestination("");
            setDate("");
            setDetails("");
            onTripAdded(); // trigger refresh
            alert("Trip added successfully! (Demo mode)");
        } catch (err) {
            console.error(err);
            alert("Failed to add trip.");
        }
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                placeholder="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="border p-2 rounded w-full"
                required
            />
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border p-2 rounded w-full"
                required
            />
            <textarea
                placeholder="Details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="border p-2 rounded w-full"
            />
            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Add Trip
            </button>
        </form>
    );
}

export default TripForm;