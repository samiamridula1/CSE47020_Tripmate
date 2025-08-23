import axios from "axios";
import config from "../config/api.js";

const API_BASE_URL = config.BACKEND_API_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;