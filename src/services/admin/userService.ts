import axios from 'axios';
import { User } from '@prisma/client';

export const createUser = async (userData : User) => {
  const response = await axios.post('/api/admin/users', userData);
  return response.data;
};

export const getUsers = async () => {
  const response = await axios.get('/api/admin/users');
  return response.data;
};

export const updateUser = async (userId : number, userData : User) => {
  const response = await axios.put(`/api/admin/users/${userId}`, userData);
  return response.data;
};

export const deleteUser = async (userId : number) => {
  const response = await axios.delete(`/api/admin/users/${userId}`);
  return response.data;
};