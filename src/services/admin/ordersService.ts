import axios from 'axios';
import { Order } from '@prisma/client';
import { getSession } from 'next-auth/react';

export const getOrders = async () => {
  const session = await getSession();
  if (!session || !session.user.accessToken) {
    throw new Error('No token found');
  }
  const response = await axios.get('/api/admin/orders', {
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });
  return response.data;
};

export const updateOrder = async (orderId: number, orderData: Order) => {
  const session = await getSession();
  if (!session || !session.user.accessToken) {
    throw new Error('No token found');
  }
  const response = await axios.put(`/api/admin/orders/${orderId}`, orderData, {
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });
  return response.data;
};

export const deleteOrder = async (orderId: number) => {
  const session = await getSession();
  if (!session || !session.user.accessToken) {
    throw new Error('No token found');
  }
  const response = await axios.delete(`/api/admin/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });
  return response.data;
};