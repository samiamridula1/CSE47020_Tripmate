import api from "./axios";

// Search locations with suggestions
export const searchLocations = async (query) => {
  try {
    const response = await api.get(`/locations/search?q=${encodeURIComponent(query)}&limit=10`);
    return response.data;
  } catch (error) {
    console.error("Error searching locations:", error);
    throw error;
  }
};

// Get all locations
export const fetchLocations = async (type = null) => {
  try {
    const url = type ? `/locations?type=${type}` : '/locations';
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching locations:", error);
    throw error;
  }
};

// Add new location (admin feature)
export const addLocation = async (locationData) => {
  try {
    const response = await api.post("/locations", locationData);
    return response.data;
  } catch (error) {
    console.error("Error adding location:", error);
    throw error;
  }
};
