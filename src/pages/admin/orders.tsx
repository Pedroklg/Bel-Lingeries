import React, { useState, useEffect } from 'react';
import { Order } from '@prisma/client';
import { getOrders, deleteOrder } from '@/services/admin/ordersService';	
import ReusableTable from '@/components/ReusableTable';
import AdminLayout from '@/layouts/AdminLayout';

const columns = [
  { id: 'id', label: 'ID' },
  { id: 'userId', label: 'User ID' },
  { id: 'createdAt', label: 'Created At' },
  { id: 'total', label: 'Total' },
];

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedOrders = await getOrders();
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (orderId: number) => {
    try {
      await deleteOrder(orderId);
      // Refresh orders list
      const fetchedOrders = await getOrders();
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <AdminLayout>
      <h1>Orders</h1>
      <ReusableTable columns={columns} data={orders} />
    </AdminLayout>
  );
};

export default OrdersPage;
