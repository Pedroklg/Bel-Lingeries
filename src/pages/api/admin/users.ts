import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import authMiddleware from '@/middleware/authMiddleware';

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      const users = await prisma.user.findMany();
      return res.status(200).json(users);
    case 'POST':
      const newUser = await prisma.user.create({
        data: req.body,
      });
      return res.status(201).json(newUser);
    case 'PUT':
      const updatedUser = await prisma.user.update({
        where: { id: req.body.id },
        data: req.body,
      });
      return res.status(200).json(updatedUser);
    case 'DELETE':
      const deletedUser = await prisma.user.delete({
        where: { id: req.body.id },
      });
      return res.status(200).json(deletedUser);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
};

export default authMiddleware(handler, true);