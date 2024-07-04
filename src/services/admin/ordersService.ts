import axios from 'axios';
import { Order } from '@prisma/client';
import { getAuthHeaders } from '@/utils/authHeaders';

export const getOrders = async () => {
  const headers = await getAuthHeaders();
  const response = await axios.get('/api/admin/orders', { headers });
  return response.data;
};

export const updateOrder = async (orderId: number, orderData: Order) => {
  const headers = await getAuthHeaders();
  const response = await axios.put(`/api/admin/orders/${orderId}`, orderData, { headers });
  return response.data;
};

export const deleteOrder = async (orderId: number) => {
  const headers = await getAuthHeaders();
  const response = await axios.delete(`/api/admin/orders/${orderId}`, { headers });
  return response.data;
};