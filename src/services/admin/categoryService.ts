import axios from 'axios';
import { getAuthHeaders } from '@/utils/authHeaders';

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