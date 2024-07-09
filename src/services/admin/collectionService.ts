import axios from 'axios';
import { getAuthHeaders } from '@/utils/authHeaders';

export const createCollection = async (data: any) => {
  const headers = await getAuthHeaders();
  const response = await axios.post('/api/collections', data, { headers });
  return response.data;
};

export const getCollections = async () => {
  const headers = await getAuthHeaders();
  const response = await axios.get('/api/collections', { headers });
  return response.data;
};

export const updateCollection = async (collectionId: number, data: any) => {
  const headers = await getAuthHeaders();
  const response = await axios.put(`/api/collections/${collectionId}`, data, { headers });
  return response.data;
};

export const deleteCollection = async (collectionId: number) => {
  const headers = await getAuthHeaders();
  const response = await axios.delete(`/api/collections/${collectionId}`, { headers });
  return response.data;
};