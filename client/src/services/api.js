import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // API Gateway URL

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const getTrains = () => api.get('/trains');
export const getTrainDetails = (trainId) => api.get(`/trains/${trainId}`);
export const createBooking = (bookingData) => api.post('/bookings', bookingData);

export default api;
