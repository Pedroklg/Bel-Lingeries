import axios from 'axios';

export const fetchOrdersSummary = async () => {
  try {
    const response = await axios.get('/api/admin/orders');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    throw error;
  }
};