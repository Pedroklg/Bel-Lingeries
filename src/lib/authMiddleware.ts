import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { User } from '@/types/models';

const secret = process.env.SECRET_KEY || '';

interface CustomNextApiRequest extends NextApiRequest {
  user?: User;
}

const authMiddleware = (handler: (req: CustomNextApiRequest, res: NextApiResponse) => Promise<void>) => async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = jwt.verify(token, secret) as User;
    if (!decodedToken) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Add decoded user to request object
    req.user = decodedToken;

    return handler(req, res);
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default authMiddleware;