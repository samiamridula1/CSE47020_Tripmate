// src/api.js
import axios from 'axios';
import config from './config/api.js';

const API = axios.create({
  baseURL: config.BACKEND_API_URL,
});

export default API;