import axios from './axios';

// Search for available hotels
export const searchHotels = async (searchData) => {
  try {
    const response = await axios.post("/hotel-bookings/search", searchData);
    return response.data;
  } catch (error) {
    console.error("Error searching hotels:", error);
    throw error;
  }
};

// Book a hotel
export const bookHotel = async (bookingData) => {
  try {
    const response = await axios.post('/hotel-bookings', bookingData);
    return response.data;
  } catch (error) {
    console.error("Error booking hotel:", error);
    throw error;
  }
};

// Get user's hotel bookings
export const getUserBookings = async (userId) => {
  try {
    const response = await axios.get(`/hotel-bookings/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting user bookings:", error);
    throw error;
  }
};

// Cancel hotel booking
export const cancelHotelBooking = async (bookingId) => {
  try {
    const response = await axios.delete(`/hotel-bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error("Error cancelling hotel booking:", error);
    throw error;
  }
};