import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const secret = process.env.SECRET_KEY || '';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = jwt.verify(token, secret) as { userId: number; isAdmin: boolean };
    if (!decodedToken) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Fetch user data from database
    const user = await prisma.user.findUnique({ where: { id: decodedToken.userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default handler;