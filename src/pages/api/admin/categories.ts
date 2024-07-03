import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import authMiddleware from '../../../middleware/authMiddleware';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case 'GET':
        const categories = await prisma.category.findMany({
          include: {
            products: true,
          },
        });
        res.status(200).json(categories);
        break;
      case 'POST':
        const { name } = req.body;

        const newCategory = await prisma.category.create({
          data: { name },
        });

        res.status(201).json(newCategory);
        break;
      case 'PUT':
        const { id, updatedName } = req.body;

        const updatedCategory = await prisma.category.update({
          where: { id: parseInt(id) },
          data: { name: updatedName },
        });

        res.status(200).json(updatedCategory);
        break;
      case 'DELETE':
        const { deleteId } = req.body;

        const deletedCategory = await prisma.category.delete({
          where: { id: parseInt(deleteId) },
        });

        res.status(200).json(deletedCategory);
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).json({ message: `Method ${req.method} Not Allowed` });
        break;
    }
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default authMiddleware(handler, true);