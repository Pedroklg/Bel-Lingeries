import axios from 'axios';
import { getAuthHeaders } from '@/utils/authHeaders';

export const createCollection = async (formData: FormData) => {
  const headers = await getAuthHeaders();
  const response = await axios.post('/api/collections', formData, { headers });
  return response.data;
};

export const getCollections = async () => {
  const headers = await getAuthHeaders();
  const response = await axios.get('/api/collections', { headers });
  return response.data;
};

export const updateCollection = async (collectionId: number, formData: FormData) => {
  const headers = await getAuthHeaders();
  const response = await axios.put(`/api/collections/${collectionId}`, formData, { headers });
  return response.data;
};

export const deleteCollection = async (collectionId: number) => {
  const headers = await getAuthHeaders();
  const response = await axios.delete(`/api/collections/${collectionId}`, { headers });
  return response.data;
};