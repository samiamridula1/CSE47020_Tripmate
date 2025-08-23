import api from "./axios";

export const fetchAllShops = async () => {
  try {
    const response = await api.get("/shops");
    return response.data;
  } catch (error) {
    console.error("Error fetching shops:", error);
    throw error;
  }
};

export const fetchShopsByLocation = async (location) => {
  try {
    const response = await api.get(`/shops/location/${location}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching shops:", error);
    throw error;
  }
};

export const addShop = async (shopData) => {
  try {
    const response = await api.post("/shops", shopData);
    return response.data;
  } catch (error) {
    console.error("Error adding shop:", error);
    throw error;
  }
};