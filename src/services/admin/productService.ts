import axios from 'axios';
import { Product } from '@prisma/client';
import { getSession } from 'next-auth/react';

export const createProduct = async (productData: Product) => {
  const session = await getSession();
  console.log('Session:', session); // Debugging log
  if (!session || !session.user.accessToken) {
    throw new Error('No token found');
  }
  const response = await axios.post('/api/admin/products', productData, {
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });
  return response.data;
};

export const getProducts = async () => {
  const session = await getSession();
  console.log('Session:', session); // Debugging log
  if (!session || !session.user.accessToken) {
    throw new Error('No token found');
  }
  const response = await axios.get('/api/admin/products', {
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });
  return response.data;
};

export const updateProduct = async (productId: number, productData: Product) => {
  const session = await getSession();
  console.log('Session:', session); // Debugging log
  if (!session || !session.user.accessToken) {
    throw new Error('No token found');
  }
  const response = await axios.put(`/api/admin/products/${productId}`, productData, {
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });
  return response.data;
};

export const deleteProduct = async (productId: number) => {
  const session = await getSession();
  console.log('Session:', session); // Debugging log
  if (!session || !session.user.accessToken) {
    throw new Error('No token found');
  }
  const response = await axios.delete(`/api/admin/products/${productId}`, {
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });
  return response.data;
};