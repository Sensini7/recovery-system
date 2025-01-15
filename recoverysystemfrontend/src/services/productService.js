import axios from 'axios';

const API_URL = 'http://localhost:5000/api/products';

// Get token from auth service
const getAuthToken = () => {
  return localStorage.getItem('token');
};

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const handleError = (error) => {
  if (error.response?.status === 403) {
    throw new Error('You do not have permission to perform this action');
  }
  throw error.response?.data || { message: 'An error occurred' };
};

export const getProducts = async () => {
  try {
    const response = await api.get('/');
    console.log('Raw API response:', response); // Debug log
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error.response?.data || { message: 'Failed to fetch products' };
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await api.put(`/${id}`, productData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update product' };
  }
};

export const updateStock = async (id, quantity) => {
  try {
    const response = await api.put(`/${id}/stock`, { quantity });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update stock' };
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await api.post('/', productData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete product' };
  }
}; 