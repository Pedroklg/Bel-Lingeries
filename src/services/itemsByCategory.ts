import axios from 'axios';
import { Product } from '@/types/models';

export const fetchProductsByCategory = async (categoryId: number): Promise<Product[]> => {
    try {
        const response = await axios(`/api/category/${categoryId}`);
        if (response.status !== 200) {
            throw new Error(`Failed to fetch products for category ID ${categoryId}`);
        }
        return response.data;
    } catch (error) {
        console.error(`Error fetching products for category ID ${categoryId}:`, error);
        throw error;
    }
};