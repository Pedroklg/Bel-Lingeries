import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import authMiddleware from '../../../middleware/authMiddleware';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case 'GET':
        const products = await prisma.product.findMany({
          include: {
            category: true,
            collection: true,
            variants: true,
          },
        });
        res.status(200).json(products);
        break;
      case 'POST':
        const { name, description, price, collectionId, categoryId } = req.body;
        console.log(req.body);

        const newProduct = await prisma.product.create({
          data: {
            name,
            description,
            price: parseFloat(price),
            collectionId: collectionId ? parseInt(collectionId) : null,
            categoryId: categoryId ? parseInt(categoryId) : null,
          },
        });

        res.status(201).json(newProduct);
        break;
      case 'PUT':
        const { id, updatedName, updatedDescription, updatedPrice, updatedCollectionId, updatedCategoryId } = req.body;

        const updatedProduct = await prisma.product.update({
          where: { id: parseInt(id) },
          data: {
            name: updatedName,
            description: updatedDescription,
            price: parseFloat(updatedPrice),
            collectionId: updatedCollectionId ? parseInt(updatedCollectionId) : null,
            categoryId: updatedCategoryId ? parseInt(updatedCategoryId) : null,
          },
        });

        res.status(200).json(updatedProduct);
        break;
      case 'DELETE':
        const { deleteId } = req.body;

        const deletedProduct = await prisma.product.delete({
          where: { id: parseInt(deleteId) },
        });

        res.status(200).json(deletedProduct);
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