import axios from 'axios';
import { User } from '../types/models';

const API_URL = '/api/auth';

export const login = async (email: string, password: string): Promise<User> => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

export const register = async (email: string, password: string, name?: string): Promise<User> => {
  const response = await axios.post(`${API_URL}/register`, { email, password, name });
  return response.data;
};

export const logout = async (): Promise<void> => {
  await axios.post(`${API_URL}/logout`);
};
