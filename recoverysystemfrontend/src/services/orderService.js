import api from './api';

export const createProductOrder = async (orderData) => {
  try {
    const response = await api.post('/cart/checkout', orderData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Please log in to complete your purchase');
    }
    throw error.response?.data || { message: 'Failed to create order' };
  }
};

export const getOrderStatus = async (orderId) => {
  try {
    const response = await api.get(`/cart/order/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get order status' };
  }
};

export const processPayment = async (orderId, paymentMethod) => {
  try {
    const response = await api.post(`/cart/order/${orderId}/payment`, { paymentMethod });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to process payment' };
  }
};

export const getMyOrders = async () => {
  try {
    const response = await api.get('/orders/my-orders');
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch orders');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error.response?.data || { message: 'Failed to fetch orders' };
  }
}; 