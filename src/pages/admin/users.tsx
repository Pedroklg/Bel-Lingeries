import React, { useState, useEffect } from 'react';
import { User } from '@prisma/client';
import { getUsers, deleteUser } from '@/services/admin/userService';
import ReusableTable from '@/components/ReusableTable';	
import AdminLayout from '@/layouts/AdminLayout';

const columns = [
  { id: 'id', label: 'ID' },
  { id: 'email', label: 'Email' },
  { id: 'name', label: 'Name' },
  { id: 'isAdmin', label: 'Admin' },
];

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (userId: number) => {
    try {
      await deleteUser(userId);
      // Refresh users list
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <AdminLayout>
      <h1>Users</h1>
      <ReusableTable columns={columns} data={users} />
    </AdminLayout>
  );
};

export default UsersPage;
