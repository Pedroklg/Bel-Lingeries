import axios from 'axios';
import { ProductVariant } from '@prisma/client';

export const createProductVariant = async (productVariantData: ProductVariant) => {
  const token = localStorage.getItem('token');
  const response = await axios.post('/api/admin/productVariants', productVariantData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getAllProductVariants = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get('/api/admin/productVariants', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getProductVariantProductId = async (productID: number) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`/api/admin/productVariants?id=${productID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateProductVariant = async (productVariantId: number, productVariantData: ProductVariant) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`/api/admin/productVariants/${productVariantId}`, productVariantData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteProductVariant = async (productVariantId: number) => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`/api/admin/productVariants/${productVariantId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};