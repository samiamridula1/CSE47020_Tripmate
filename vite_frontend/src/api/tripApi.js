import axios from "./axios";

export const getTrips = async (userId) => {
  try {
    const res = await axios.get(`/trips/${userId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching trips:", error);
    throw error;
  }
};

export const createTrip = async (tripData) => {
  try {
    const res = await axios.post("/trips", tripData);
    return res.data;
  } catch (error) {
    console.error("Error creating trip:", error);
    throw error;
  }
};

export const updateTrip = async (id, tripData) => {
  try {
    const res = await axios.put(`/trips/${id}`, tripData);
    return res.data;
  } catch (error) {
    console.error("Error updating trip:", error);
    throw error;
  }
};

export const deleteTrip = async (id) => {
  try {
    const res = await axios.delete(`/trips/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting trip:", error);
    throw error;
  }
};

// Photo management functions
export const addTripPhoto = async (tripId, photoData) => {
  try {
    const res = await axios.post(`/trips/${tripId}/photos`, photoData);
    return res.data;
  } catch (error) {
    console.error("Error adding trip photo:", error);
    throw error;
  }
};

export const removeTripPhoto = async (tripId, photoIndex) => {
  try {
    const res = await axios.delete(`/trips/${tripId}/photos/${photoIndex}`);
    return res.data;
  } catch (error) {
    console.error("Error removing trip photo:", error);
    throw error;
  }
};

// Trip status management
export const updateTripStatus = async (tripId, status) => {
  try {
    const res = await axios.patch(`/trips/${tripId}/status`, { status });
    return res.data;
  } catch (error) {
    console.error("Error updating trip status:", error);
    throw error;
  }
};

// Alias for backward compatibility
export const fetchTrips = getTrips;