import axios from 'axios';
import { Category } from '@prisma/client';

export const createCategory = async (categoryData : Category) => {
  const response = await axios.post('/api/admin/categories', categoryData);
  return response.data;
};

export const getCategories = async () => {
  const response = await axios.get('/api/admin/categories');
  return response.data;
};

export const updateCategory = async (categoryId : number, categoryData : Category) => {
  const response = await axios.put(`/api/admin/categories/${categoryId}`, categoryData);
  return response.data;
};

export const deleteCategory = async (categoryId : number) => {
  const response = await axios.delete(`/api/admin/categories/${categoryId}`);
  return response.data;
};