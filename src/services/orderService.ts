import axios from 'axios';
import { ApiResponse } from '../types/api';
import { Order } from '../types/models';

const API_URL = '/api/orders';

export const fetchAllOrders = async (): Promise<Order[]> => {
  const response = await axios.get<ApiResponse<Order[]>>(API_URL);
  return response.data.data;
};

export const fetchOrderById = async (id: number): Promise<Order> => {
  const response = await axios.get<ApiResponse<Order>>(`${API_URL}/${id}`);
  return response.data.data;
};

export const createOrder = async (order: Order): Promise<Order> => {
  const response = await axios.post<ApiResponse<Order>>(API_URL, order);
  return response.data.data;
};

export const updateOrder = async (id: number, order: Order): Promise<Order> => {
  const response = await axios.put<ApiResponse<Order>>(`${API_URL}/${id}`, order);
  return response.data.data;
};

export const deleteOrder = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
