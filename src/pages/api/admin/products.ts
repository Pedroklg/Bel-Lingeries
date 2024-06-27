import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import authMiddleware from '../../../middleware/authMiddleware';

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      const products = await prisma.product.findMany();
      return res.status(200).json(products);
    case 'POST':
      const newProduct = await prisma.product.create({
        data: req.body,
      });
      return res.status(201).json(newProduct);
    case 'PUT':
      const updatedProduct = await prisma.product.update({
        where: { id: req.body.id },
        data: req.body,
      });
      return res.status(200).json(updatedProduct);
    case 'DELETE':
      const deletedProduct = await prisma.product.delete({
        where: { id: req.body.id },
      });
      return res.status(200).json(deletedProduct);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
};

export default authMiddleware(handler, true);