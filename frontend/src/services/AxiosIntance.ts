// axiosInstance.js
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL
const axiosInstance = axios.create({
  baseURL: BACKEND_URL, // Replace with your API base URL
  timeout: 10000, // Optional: request timeout in ms
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add token here if needed
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error: Error) => Promise.reject(error)
);

export default axiosInstance;
