import axios from 'axios';
import { Category } from '../types/models';

const API_URL = '/api/categories';

export const fetchAllCategories = async (): Promise<Category[]> => {
  const response = await axios.get<Category[]>(API_URL);
  return response.data;
};

export const createCategory = async (category: Category): Promise<Category> => {
  const response = await axios.post<Category>(API_URL, category);
  return response.data;
};

export const updateCategory = async (id: number, category: Category): Promise<Category> => {
  const response = await axios.put<Category>(`${API_URL}/${id}`, category);
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};