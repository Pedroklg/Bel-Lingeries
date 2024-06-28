import axios from 'axios';
import { User } from '@prisma/client';
import { getSession } from 'next-auth/react';

export const getUsers = async () => {
  const session = await getSession();
  if (!session || !session.user.accessToken) {
    throw new Error('No token found');
  }
  const response = await axios.get('/api/admin/users', {
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });
  return response.data;
};

export const updateUser = async (userId: number, userData: User) => {
  const session = await getSession();
  if (!session || !session.user.accessToken) {
    throw new Error('No token found');
  }
  const response = await axios.put(`/api/admin/users/${userId}`, userData, {
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });
  return response.data;
};

export const deleteUser = async (userId: number) => {
  const session = await getSession();
  if (!session || !session.user.accessToken) {
    throw new Error('No token found');
  }
  const response = await axios.delete(`/api/admin/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });
  return response.data;
};
