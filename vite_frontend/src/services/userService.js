import api from "./api";

export const userService = {
    // Get user profile
    getUserProfile: async (firebaseUid) => {
        try {
            const response = await api.get(`/users/${firebaseUid}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching user profile:", error);
            throw error;
        }
    },

    saveUserProfile: async (profileData) => {
        try {
            const response = await api.post("/users/profile", profileData);
            return response.data;
        } catch (error) {
            console.error("Error saving user profile:", error);
            throw error;
        }
    },

    // Delete user
    deleteUser: async (userId) => {
        try {
            const response = await api.delete(`/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
    },
};