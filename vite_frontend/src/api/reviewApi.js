import api from "./axios";

export const fetchAllReviews = async () => {
  try {
    const response = await api.get("/reviews");
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

export const fetchReviewsByLocation = async (location) => {
  try {
    const response = await api.get(`/reviews/location/${location}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews by location:", error);
    throw error;
  }
};

export const fetchReviewsByUser = async (userId) => {
  try {
    const response = await api.get(`/reviews/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    throw error;
  }
};

export const addReview = async (reviewData) => {
  try {
    const response = await api.post("/reviews", reviewData);
    return response.data;
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};
