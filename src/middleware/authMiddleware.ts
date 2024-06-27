import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { User } from '@/types/models';

const secret = process.env.SECRET_KEY || '';

interface CustomNextApiRequest extends NextApiRequest {
  user?: User;
}

const authMiddleware = (
  handler: (req: CustomNextApiRequest, res: NextApiResponse) => Promise<void>,
  requireAdmin = false
) => async (req: CustomNextApiRequest, res: NextApiResponse) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = jwt.verify(token, secret) as User;
    req.user = decodedToken;

    if (requireAdmin && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    return handler(req, res);
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default authMiddleware;