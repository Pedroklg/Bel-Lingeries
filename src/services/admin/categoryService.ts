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

export const createCategory = async (data: any) => {
  const headers = await getAuthHeaders();
  const response = await axios.post('/api/categories', data, { headers });
  return response.data;
};

export const getCategories = async () => {
  const headers = await getAuthHeaders();
  const response = await axios.get('/api/categories', { headers });
  return response.data;
};

export const updateCategory = async (categoryId: number, data: any) => {
  const headers = await getAuthHeaders();
  const response = await axios.put(`/api/categories/${categoryId}`, data, { headers });
  return response.data;
};

export const deleteCategory = async (categoryId: number) => {
  const headers = await getAuthHeaders();
  const response = await axios.delete(`/api/categories/${categoryId}`, { headers });
  return response.data;
};