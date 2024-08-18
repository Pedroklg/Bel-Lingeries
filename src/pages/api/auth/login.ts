import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const secret = process.env.SECRET_KEY || 'default_secret_key';

const createToken = (userId: number, isAdmin: boolean) => {
  return jwt.sign({ userId, isAdmin }, secret, { expiresIn: '1h' });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    
    const token = createToken(user.id, user.isAdmin);
    console.log('Token created:', token);
    res.status(200).json({ token }); 

  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default handler;
