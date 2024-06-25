import axios from 'axios';
import { Collection } from '../types/models';

const API_URL = '/api/collections';

export const fetchCollections = async (): Promise<Collection[]> => {
  try {
    const response = await axios.get<Collection[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
};