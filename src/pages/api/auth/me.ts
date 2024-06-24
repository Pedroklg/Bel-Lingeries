import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

// Example: Mock users data (replace with your actual user fetching logic)
const users = [
  { id: 1, email: 'user@example.com', isAdmin: false },
  { id: 2, email: 'admin@example.com', isAdmin: true },
];

const secret = process.env.SECRET_KEY;

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = jwt.verify(token, secret || '') as { userId: number; isAdmin: boolean } | undefined;
    if (!decodedToken) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    const { userId, isAdmin } = decodedToken;
    // Fetch user data from database or mock users
    const user = users.find(u => u.id === decodedToken.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default handler;
