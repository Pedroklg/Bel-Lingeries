import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock users for demonstration purposes
const users = [
  { id: 1, email: 'user@example.com', passwordHash: '$2a$10$uWc5Lc3E7gB7QVrPcUc8hegq1gRVlCJtqTf5ZoWQX.rlbVXwy2wD2' }, // password: password123
  { id: 2, email: 'admin@example.com', passwordHash: '$2a$10$KCG5VrK3jyH7aCslY9GZmO5.AKGr2yPpVvpE1G/J7GyS4U0r9h7Yi' }, // password: admin123
];

const secret = process.env.SECRET_KEY;

const createToken = (userId: number, isAdmin: boolean) => {
  if (!secret) {
    throw new Error('Secret key is undefined');
  }
  return jwt.sign({ userId, isAdmin }, secret, { expiresIn: '1h' });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  const isAdmin = user.email === 'admin@example.com'; // Replace with actual admin check logic

  const token = createToken(user.id, isAdmin);

  res.status(200).json({ token });
};

export default handler;
