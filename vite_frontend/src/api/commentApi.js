import axios from './axios';

// Get comments for an experience
export const getComments = async (experienceId) => {
  try {
    const response = await axios.get(`/comments/experience/${experienceId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

// Add a comment to an experience
export const addComment = async (commentData) => {
  try {
    const response = await axios.post('/comments', commentData);
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Delete a comment
export const deleteComment = async (commentId, userId) => {
  try {
    const response = await axios.delete(`/comments/${commentId}`, {
      data: { userId }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};
