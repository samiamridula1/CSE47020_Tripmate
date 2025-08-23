import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // adjust if deployed
  withCredentials: true // if you're using cookies/session
});

export default instance;