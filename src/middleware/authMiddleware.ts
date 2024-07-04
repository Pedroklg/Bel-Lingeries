import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { getSession } from 'next-auth/react';

interface CustomNextApiRequest extends NextApiRequest {
  user?: any;
}

const authMiddleware = (handler: NextApiHandler, requireAdmin: boolean = false) => {
  return async (req: CustomNextApiRequest, res: NextApiResponse) => {
    try {
      const session = await getSession({ req });
      console.log('Session:', session);

      if (!session || !session.user || !session.user.accessToken) {
        console.log('Unauthorized access attempt:', session);
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (requireAdmin && !session.user.isAdmin) {
        console.log('Forbidden access attempt by non-admin:', session);
        return res.status(403).json({ message: 'Forbidden' });
      }

      req.user = session.user; // Attach the user to the request object

      return handler(req, res);
    } catch (error) {
      console.error('Error in authMiddleware:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};

export default authMiddleware;