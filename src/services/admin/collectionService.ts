import axios from 'axios';
import { Collection } from '@prisma/client';
import { getSession } from 'next-auth/react';

export const createCollection = async (collectionData: Collection) => {
  const session = await getSession();
  if (!session || !session.user.accessToken) {
    throw new Error('No token found');
  }
  const response = await axios.post('/api/admin/collections', collectionData, {
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });
  return response.data;
};

export const getCollections = async () => {
  const session = await getSession();
  if (!session || !session.user.accessToken) {
    throw new Error('No token found');
  }
  const response = await axios.get('/api/admin/collections', {
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });
  return response.data;
};

export const updateCollection = async (collectionId: number, collectionData: Collection) => {
  const session = await getSession();
  if (!session || !session.user.accessToken) {
    throw new Error('No token found');
  }
  const response = await axios.put(`/api/admin/collections/${collectionId}`, collectionData, {
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });
  return response.data;
};

export const deleteCollection = async (collectionId: number) => {
  const session = await getSession();
  if (!session || !session.user.accessToken) {
    throw new Error('No token found');
  }
  const response = await axios.delete(`/api/admin/collections/${collectionId}`, {
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });
  return response.data;
};