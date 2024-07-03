import axios from 'axios';
import { getSession } from 'next-auth/react';

const BASE_URL = '/api/admin/productVariants';

const getAuthHeaders = async () => {
  const session = await getSession();
  if (!session || !session.user.accessToken) {
    throw new Error('No token found');
  }
  return {
    Authorization: `Bearer ${session.user.accessToken}`,
  };
};

export const createProductVariant = async (formData: FormData) => {
  const headers = await getAuthHeaders();
  const response = await axios.post(BASE_URL, formData, { headers });
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

export const updateProductVariant = async (variantId: number, formData: FormData) => {
  const headers = await getAuthHeaders();
  const response = await axios.put(`${BASE_URL}/${variantId}`, formData, { headers });
  return response.data;
};

export const deleteProductVariant = async (variantId: number) => {
  const headers = await getAuthHeaders();
  const response = await axios.delete(`${BASE_URL}/${variantId}`, { headers });
  return response.data;
};
