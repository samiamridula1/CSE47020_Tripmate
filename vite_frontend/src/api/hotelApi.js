import axios from './axios';

// Fetch all hotels
export const fetchHotels = () => axios.get('/hotels');

// Book a hotel
export const bookHotel = (bookingData) => axios.post('/hotels/bookings', bookingData);

// Get user's hotel bookings
export const getUserBookings = (userId) => axios.get(`/hotels/bookings/${userId}`);

// Get booking details
export const getBookingDetails = (bookingId) => axios.get(`/hotels/bookings/${bookingId}`);