import { getSession } from 'next-auth/react';

export const getAuthHeaders = async () => {
  const session = await getSession();
  if (!session || !session.user.accessToken) {
    throw new Error('No token found');
  }
  return {
    Authorization: `Bearer ${session.user.accessToken}`,
  };
};