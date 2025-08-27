import api from "./axios";

// Search for available transport options
export const searchTransport = async (searchData) => {
  try {
    const response = await api.post("/transport/search", searchData);
    return response.data;
  } catch (error) {
    console.error("Error searching transport:", error);
    throw error;
  }
};

export const fetchAllBookings = async () => {
  try {
    const response = await api.get("/transport");
    return response.data;
  } catch (error) {
    console.error("Error fetching transport bookings:", error);
    throw error;
  }
};

export const fetchUserBookings = async (userId) => {
  try {
    const response = await api.get(`/transport/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    throw error;
  }
};

export const createBooking = async (bookingData) => {
  try {
    const response = await api.post("/transport", bookingData);
    return response.data;
  } catch (error) {
    console.error("Error creating transport booking:", error);
    throw error;
  }
};

export const updateBooking = async (bookingId, bookingData) => {
  try {
    const response = await api.put(`/transport/${bookingId}`, bookingData);
    return response.data;
  } catch (error) {
    console.error("Error updating booking:", error);
    throw error;
  }
};

export const deleteBooking = async (bookingId) => {
  try {
    const response = await api.delete(`/transport/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error;
  }
};
