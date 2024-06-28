import axios from 'axios';
import { Category } from '@prisma/client';
import { getSession } from 'next-auth/react';

export const createCategory = async (categoryData: Category) => {
  const session = await getSession();
  if (!session || !session.user.accessToken) {
    throw new Error('No token found');
  }
  const response = await axios.post('/api/admin/categories', categoryData, {
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });
  return response.data;
};

export const getCategories = async () => {
  const session = await getSession();
  if (!session || !session.user.accessToken) {
    throw new Error('No token found');
  }
  const response = await axios.get('/api/admin/categories', {
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });
  return response.data;
};

export const updateCategory = async (categoryId: number, categoryData: Category) => {
  const session = await getSession();
  if (!session || !session.user.accessToken) {
    throw new Error('No token found');
  }
  const response = await axios.put(`/api/admin/categories/${categoryId}`, categoryData, {
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });
  return response.data;
};

export const deleteCategory = async (categoryId: number) => {
  const session = await getSession();
  if (!session || !session.user.accessToken) {
    throw new Error('No token found');
  }
  const response = await axios.delete(`/api/admin/categories/${categoryId}`, {
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });
  return response.data;
};