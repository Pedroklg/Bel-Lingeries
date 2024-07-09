import axios from 'axios';
import { getAuthHeaders } from '@/utils/authHeaders';

const BASE_URL = '/api/admin/productVariants';

export const createProductVariant = async (data :  any) => {
  const headers = await getAuthHeaders();
  const response = await axios.post(BASE_URL, data, { headers });
  return response.data;
};

export const getProductVariantById = async (productId: number) => {
  const headers = await getAuthHeaders();
  const response = await axios.get(`${BASE_URL}/${productId}`, { headers });
  return response.data;
};

export const getProductVariants = async () => {
  const headers = await getAuthHeaders();
  const response = await axios.get(BASE_URL, { headers });
  return response.data;
};

export const updateProductVariant = async (variantId: number, data: any) => {
  const headers = await getAuthHeaders();
  const response = await axios.put(`${BASE_URL}/${variantId}`, data, { headers });
  return response.data;
};

export const deleteProductVariant = async (variantId: number) => {
  const headers = await getAuthHeaders();
  const response = await axios.delete(`${BASE_URL}/${variantId}`, { headers });
  return response.data;
};
