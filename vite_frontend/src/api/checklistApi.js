import axios from './axios';

export const getChecklist = async (userId) => {
  try {
    const response = await axios.get(`/checklists/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching checklist:", error);
    throw error;
  }
};

export const updateChecklist = async (userId, items) => {
  try {
    const response = await axios.put(`/checklists/${userId}`, { items });
    return response.data;
  } catch (error) {
    console.error("Error updating checklist:", error);
    throw error;
  }
};

export const addChecklistItem = async (userId, text) => {
  try {
    const response = await axios.post(`/checklists/${userId}/items`, { text });
    return response.data;
  } catch (error) {
    console.error("Error adding checklist item:", error);
    throw error;
  }
};

export const removeChecklistItem = async (userId, itemId) => {
  try {
    const response = await axios.delete(`/checklists/${userId}/items/${itemId}`);
    return response.data;
  } catch (error) {
    console.error("Error removing checklist item:", error);
    throw error;
  }
};
