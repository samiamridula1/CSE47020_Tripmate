import React, { useState } from 'react';
import axios from 'axios';

function TripForm({ userId }) {
  const [trip, setTrip] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    notes: '',
    status: 'Planned'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrip({ ...trip, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTrip = { ...trip, userId };
      await axios.post('http://localhost:5000/api/trips', newTrip);
      alert('Trip added!');
      setTrip({
        destination: '',
        startDate: '',
        endDate: '',
        notes: '',
        status: 'Planned'
      });
    } catch (err) {
      console.error(err);
      alert('Error saving trip');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
      <input type="text" name="destination" value={trip.destination} onChange={handleChange} placeholder="Destination" required />
      <input type="date" name="startDate" value={trip.startDate} onChange={handleChange} required />
      <input type="date" name="endDate" value={trip.endDate} onChange={handleChange} required />
      <textarea name="notes" value={trip.notes} onChange={handleChange} placeholder="Notes (optional)" />
      <select name="status" value={trip.status} onChange={handleChange}>
        <option value="Planned">Planned</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </select>
      <button type="submit">Add Trip</button>
    </form>
  );
}

export default TripForm;
