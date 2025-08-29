import axios from './axios';

// Toggle like on an experience
export const toggleLike = async (userId, experienceId) => {
  try {
    const response = await axios.post('/likes/toggle', { userId, experienceId });
    return response.data;
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};

// Get like count and user's like status for an experience
export const getLikeData = async (experienceId, userId = null) => {
  try {
    const response = await axios.get(`/likes/experience/${experienceId}`, {
      params: userId ? { userId } : {}
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching like data:', error);
    throw error;
  }
};
