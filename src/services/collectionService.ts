import axios from 'axios';
import { Collection } from '../types/models';

const API_URL = '/api/collections';

export const fetchCollections = async (): Promise<Collection[]> => {
    const response = await axios.get<Collection[]>(API_URL);
    return response.data;
};