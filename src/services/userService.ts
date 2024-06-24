import axios from 'axios';
import { ApiResponse } from '../types/api';
import { User } from '../types/models';

const API_URL = '/api/users';

export const fetchAllUsers = async (): Promise<User[]> => {
  const response = await axios.get<ApiResponse<User[]>>(API_URL);
  return response.data.data;
};

export const fetchUserById = async (id: number): Promise<User> => {
  const response = await axios.get<ApiResponse<User>>(`${API_URL}/${id}`);
  return response.data.data;
};

export const updateUser = async (id: number, user: User): Promise<User> => {
  const response = await axios.put<ApiResponse<User>>(`${API_URL}/${id}`, user);
  return response.data.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
