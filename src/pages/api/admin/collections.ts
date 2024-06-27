import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import authMiddleware from '@/middleware/authMiddleware';

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      const collections = await prisma.collection.findMany();
      return res.status(200).json(collections);
    case 'POST':
      const newCollection = await prisma.collection.create({
        data: req.body,
      });
      return res.status(201).json(newCollection);
    case 'PUT':
      const updatedCollection = await prisma.collection.update({
        where: { id: req.body.id },
        data: req.body,
      });
      return res.status(200).json(updatedCollection);
    case 'DELETE':
      const deletedCollection = await prisma.collection.delete({
        where: { id: req.body.id },
      });
      return res.status(200).json(deletedCollection);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
};

export default authMiddleware(handler, true);