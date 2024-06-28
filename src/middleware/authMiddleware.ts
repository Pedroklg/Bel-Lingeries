import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { getSession } from 'next-auth/react';

interface CustomNextApiRequest extends NextApiRequest {
  user?: any;
}

const authMiddleware = (handler: NextApiHandler, requireAdmin: boolean = false) => {
  return async (req: CustomNextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });

    if (!session || !session.user || !session.user.accessToken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (requireAdmin && !session.user.isAdmin) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    req.user = session.user; // Attach the user to the request object

    return handler(req, res);
  };
};

export default authMiddleware;