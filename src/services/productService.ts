import axios from 'axios';
import { ProductResponse } from '@/types/api';
import { Product } from '@/types/models';
import { mapApiProductVariantToModel } from '@/utils/ProductResponseProduct';

const API_URL = '/api/products';

export const fetchAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(`${API_URL}?type=all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all products:', error);
    throw error;
  }
};

export const fetchProductById = async (id: number): Promise<Product> => {
  try { 
    const response = await axios.get<ProductResponse>(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

export const createProduct = async (product: ProductResponse): Promise<Product> => {
  try {
    const response = await axios.post<Product>(API_URL, product);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (id: number, product: ProductResponse): Promise<Product> => {
  try {
    const response = await axios.put<Product>(`${API_URL}/${id}`, product);
    return response.data;
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw error;
  }
};

export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw error;
  }
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
      createdAt: new Date(productResponse.createdAt),
      soldCount: productResponse.soldCount,
    }));
    return products;
  } catch (error) {
    console.error('Error fetching newest products:', error);
    throw error;
  }
};

export const fetchBestSellers = async (limit: number): Promise<Product[]> => {
  try {
    const response = await axios.get<ProductResponse[]>(`${API_URL}?type=best-sellers&limit=${limit}`);
    const products: Product[] = response.data.map(productResponse => ({
      id: productResponse.id,
      name: productResponse.name,
      description: productResponse.description,
      price: productResponse.price,
      variants: productResponse.variants.map(mapApiProductVariantToModel),
      categoryId: productResponse.categoryId,
      collectionId: productResponse.collectionId,
      createdAt: new Date(productResponse.createdAt),
      soldCount: productResponse.soldCount,
    }));
    return products;
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    throw error;
  }
};
