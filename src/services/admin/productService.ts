import axios from 'axios';
import { getSession } from 'next-auth/react';

const getAuthHeaders = async () => {
  const session = await getSession();
  if (!session || !session.user.accessToken) {
    throw new Error('No token found');
  }
  return {
    Authorization: `Bearer ${session.user.accessToken}`,
  };
};

export const createProduct = async (data: any) => {
  const headers = await getAuthHeaders();
  const response = await axios.post('/api/products', data, { headers });
  return response.data;
};

export const getProducts = async () => {
  const headers = await getAuthHeaders();
  const response = await axios.get('/api/products', { headers });
  return response.data;
};

export const updateProduct = async (productId: number, data: any) => {
  const headers = await getAuthHeaders();
  const response = await axios.put(`/api/products/${productId}`, data, { headers });
  return response.data;
};

export const deleteProduct = async (productId: number) => {
  const headers = await getAuthHeaders();
  const response = await axios.delete(`/api/products/${productId}`, { headers });
  return response.data;
};