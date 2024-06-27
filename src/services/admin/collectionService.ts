import axios from 'axios';
import { Collection } from '@prisma/client';

export const createCollection = async (collectionData : Collection) => {
  const response = await axios.post('/api/admin/collections', collectionData);
  return response.data;
};

export const getCollections = async () => {
  const response = await axios.get('/api/admin/collections');
  return response.data;
};

export const updateCollection = async (collectionId : number, collectionData : Collection) => {
  const response = await axios.put(`/api/admin/collections/${collectionId}`, collectionData);
  return response.data;
};

export const deleteCollection = async (collectionId : number) => {
  const response = await axios.delete(`/api/admin/collections/${collectionId}`);
  return response.data;
};