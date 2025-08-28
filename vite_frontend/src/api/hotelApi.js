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

// Fetch all hotels
export const fetchHotels = () => axios.get('/hotels');

// Book a hotel
export const bookHotel = (bookingData) => axios.post('/hotel-bookings', bookingData);

// Get user's hotel bookings
export const getUserBookings = (userId) => axios.get(`/hotel-bookings/user/${userId}`);

// Get booking details
export const getBookingDetails = (bookingId) => axios.get(`/hotel-bookings/${bookingId}`);

// Update hotel booking
export const updateHotelBooking = async (bookingId, bookingData) => {
  try {
    const response = await axios.put(`/hotel-bookings/${bookingId}`, bookingData);
    return response.data;
  } catch (error) {
    console.error("Error updating hotel booking:", error);
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

// Get hotel providers
export const fetchHotelProviders = async () => {
  try {
    const response = await axios.get("/hotel-bookings/providers");
    return response.data;
  } catch (error) {
    console.error("Error fetching hotel providers:", error);
    throw error;
  }
};