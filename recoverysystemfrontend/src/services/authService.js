import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Create axios instance with credentials
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const handleAuthResponse = (response) => {
  if (response.data.success) {
    const userData = response.data.data;
    // Store user data and token in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token);
    
    // Set authorization header for future requests
    api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
  }
  return response.data;
};

export const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    return handleAuthResponse(response);
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Login failed' };
  }
};

export const logout = () => {
  // Clear localStorage
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  
  // Remove authorization header
  delete api.defaults.headers.common['Authorization'];
};

// Add this utility function
export const getStoredUser = () => {
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
};

export const register = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    return handleAuthResponse(response);
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Registration failed' };
  }
}; 