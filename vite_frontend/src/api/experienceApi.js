export const updateExperience = async (experienceId, experienceData) => {
  try {
    const response = await axios.put(`/experiences/${experienceId}`, experienceData);
    return response.data;
  } catch (error) {
    console.error("Error updating experience:", error);
    throw error;
  }
};
import axios from './axios';

export const getAllExperiences = async () => {
  try {
    const response = await axios.get("/experiences");
    return response.data;
  } catch (error) {
    console.error("Error fetching experiences:", error);
    throw error;
  }
};

export const createExperience = async (experienceData) => {
  try {
    const response = await axios.post("/experiences", experienceData);
    return response.data;
  } catch (error) {
    console.error("Error creating experience:", error);
    throw error;
  }
};

export const getFeaturedExperiences = async () => {
  try {
    const response = await axios.get("/experiences/featured");
    return response.data;
  } catch (error) {
    console.error("Error fetching featured experiences:", error);
    throw error;
  }
};

export const getUserExperiences = async (userId) => {
  try {
    const response = await axios.get(`/experiences/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user experiences:", error);
    throw error;
  }
};

export const deleteExperience = async (experienceId, userId) => {
  try {
    const response = await axios.delete(`/experiences/${experienceId}`, {
      data: { userId }
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting experience:", error);
    throw error;
  }
};