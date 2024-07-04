import axios from 'axios';
import { User } from '@prisma/client';
import { getAuthHeaders } from '@/utils/authHeaders';

export const getUsers = async () => {
  const headers = await getAuthHeaders();
  const response = await axios.get('/api/admin/users', { headers });
  return response.data;
};

export const updateUser = async (userId: number, userData: User) => {
  const headers = await getAuthHeaders();
  const response = await axios.put(`/api/admin/users/${userId}`, userData, { headers });
  return response.data;
};

export const deleteUser = async (userId: number) => {
  const headers = await getAuthHeaders();
  const response = await axios.delete(`/api/admin/users/${userId}`, { headers });
  return response.data;
};
