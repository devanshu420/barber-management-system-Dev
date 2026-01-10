import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token automatically if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      // window.location.href = '/login'; // uncomment if you want auto redirect
    }
    return Promise.reject(error);
  }
);

// API functions
export const login = async (credentials) => {
  const res = await API.post('/auth/login', credentials);
  return res.data; // { user, token }
};

export const register = async (userData) => {
  const res = await API.post('/auth/register', userData);
  return res.data; // { user, token }
};

export const logout = async () => {
  const res = await API.post('/auth/logout');
  return res.data;
};

export const updateProfile = async (profileData) => {
  const res = await API.put('/users/profile', profileData);
  return res.data; // { user }
};

export const getProfile = async () => {
  const res = await API.get('/users/profile');
  return res.data; // { user }
};

export default API;
