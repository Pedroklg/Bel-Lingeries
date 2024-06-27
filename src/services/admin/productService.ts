import axios from 'axios';
import { Product } from '@prisma/client';

export const createProduct = async (productData : Product) => {
  const response = await axios.post('/api/admin/products', productData);
  return response.data;
};

export const getProducts = async () => {
  const response = await axios.get('/api/admin/products');
  return response.data;
};

export const updateProduct = async (productId : number, productData :Product) => {
  const response = await axios.put(`/api/admin/products/${productId}`, productData);
  return response.data;
};

export const deleteProduct = async (productId : number) => {
  const response = await axios.delete(`/api/admin/products/${productId}`);
  return response.data;
};