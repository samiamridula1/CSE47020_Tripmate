import api from "./api";

export const tripService = {
    // Get all trips for a user
    getUserTrips: async (userId) => {
        try {
            const response = await api.get(`/trips/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching user trips:", error);
            throw error;
        }
    },

    createTrip: async (tripData) => {
        try {
            const response = await api.post("/trips", tripData);
            return response.data;
        } catch (error) {
            console.error("Error creating trip:", error);
            throw error;
        }
    },

    // Update a trip
    updateTrip: async (tripId, tripData) => {
        try {
            const response = await api.put(`/trips/${tripId}`, tripData);
            return response.data;
        } catch (error) {
            console.error("Error updating trip:", error);
            throw error;
        }
    },

    // Delete a trip
    deleteTrip: async (tripId) => {
        try {
            const response = await api.delete(`/trips/${tripId}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting trip:", error);
            throw error;
        }
    },
};