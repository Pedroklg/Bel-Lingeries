import axios from 'axios';
import { ProductResponse } from '@/types/api';
import { Product } from '@/types/models';
import { mapApiProductVariantToModel } from '@/utils/ProductResponseProduct';

const API_URL = '/api/products';

export const fetchAllProducts = async (): Promise<ProductResponse[]> => {
  const response = await axios.get<ProductResponse[]>(`${API_URL}?type=all`);
  return response.data;
};

export const fetchProductById = async (id: number): Promise<ProductResponse> => {
  const response = await axios.get<ProductResponse>(`${API_URL}/${id}`);
  return response.data;
};

export const createProduct = async (product: ProductResponse): Promise<ProductResponse> => {
  const response = await axios.post<ProductResponse>(API_URL, product);
  return response.data;
};

export const updateProduct = async (id: number, product: ProductResponse): Promise<ProductResponse> => {
  const response = await axios.put<ProductResponse>(`${API_URL}/${id}`, product);
  return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

export const fetchNewestProducts = async (limit: number): Promise<Product[]> => {
  try {
    const response = await axios.get<ProductResponse[]>(`${API_URL}?type=newest&limit=${limit}`);
    const products: Product[] = response.data.map(productResponse => ({
      id: productResponse.id,
      name: productResponse.name,
      description: productResponse.description,
      price: productResponse.price,
      variants: productResponse.variants.map(mapApiProductVariantToModel),
      categoryId: productResponse.categoryId,
      collectionId: productResponse.collectionId,
    }));
    return products;
  } catch (error) {
    console.error('Error fetching newest products:', error);
    throw error;
  }
};
