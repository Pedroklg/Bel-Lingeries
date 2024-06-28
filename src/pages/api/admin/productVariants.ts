import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import authMiddleware from '../../../middleware/authMiddleware';

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      if (req.query.id) {
        const productVariant = await prisma.productVariant.findUnique({
          where: { id: Number(req.query.id) || undefined },
        });
        return res.status(200).json(productVariant);
      }else {
        const productVariants = await prisma.productVariant.findMany();
        return res.status(200).json(productVariants);
      }
    case 'POST':
      const newProductVariant = await prisma.productVariant.create({
        data: req.body,
      });
      return res.status(201).json(newProductVariant);
    case 'PUT':
      const updatedProductVariant = await prisma.productVariant.update({
        where: { id: Number(req.query.id) || undefined },
        data: req.body,
      });
      return res.status(200).json(updatedProductVariant);
    case 'DELETE':
      const deletedProductVariant = await prisma.productVariant.delete({
        where: { id: Number(req.query.id) || undefined },
      });
      return res.status(200).json(deletedProductVariant);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
};

export default authMiddleware(handler, true);