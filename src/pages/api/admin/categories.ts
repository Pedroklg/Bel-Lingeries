import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import authMiddleware from '@/middleware/authMiddleware';

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      const categories = await prisma.category.findMany();
      return res.status(200).json(categories);
    case 'POST':
      const newCategory = await prisma.category.create({
        data: req.body,
      });
      return res.status(201).json(newCategory);
    case 'PUT':
      const updatedCategory = await prisma.category.update({
        where: { id: req.body.id },
        data: req.body,
      });
      return res.status(200).json(updatedCategory);
    case 'DELETE':
      const deletedCategory = await prisma.category.delete({
        where: { id: req.body.id },
      });
      return res.status(200).json(deletedCategory);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
};

export default authMiddleware(handler, true);