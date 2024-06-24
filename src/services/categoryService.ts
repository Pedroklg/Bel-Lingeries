import axios from 'axios';
import { ApiResponse } from '../types/api';
import { Category } from '../types/models';

const API_URL = '/api/categories';

export const fetchAllCategories = async (): Promise<Category[]> => {
  const response = await axios.get<ApiResponse<Category[]>>(API_URL);
  return response.data.data;
};

export const createCategory = async (category: Category): Promise<Category> => {
  const response = await axios.post<ApiResponse<Category>>(API_URL, category);
  return response.data.data;
};

export const updateCategory = async (id: number, category: Category): Promise<Category> => {
  const response = await axios.put<ApiResponse<Category>>(`${API_URL}/${id}`, category);
  return response.data.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
