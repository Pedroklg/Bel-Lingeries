import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query: { id } = {} } = req;
  const productId = Number(id);

  if (isNaN(productId)) {
    res.status(400).json({ error: 'Invalid product ID' });
    return;
  }

  switch (method) {
    case 'GET':
      try {
        const product = await prisma.product.findUnique({
          where: { id: productId },
          include: {
            category: true,
            variants: {
              include: {
                additionalImages: true,
              },
            },
          },
        });
        if (!product) {
          res.status(404).json({ error: 'Product not found' });
        } else {
          res.status(200).json(product);
        }
      } catch (error) {
        console.error(`Error fetching product ${productId}:`, error);
        res.status(500).json({ error: `Failed to fetch product ${productId}` });
      }
      break;

    case 'PUT':
      try {
        const { name, description, price, categories, variants } = req.body;

        const updatedProduct = await prisma.product.update({
          where: { id: productId },
          data: {
            name,
            description,
            price,
            category: {
              connect: categories.map((categoryId: number) => ({ id: categoryId })),
            },
            variants: {
              deleteMany: {},
              create: variants.map((variant: any) => ({
                ...variant,
                additionalImages: {
                  createMany: {
                    data: variant.additionalImages.map((image: any) => ({
                      imageUrl: image.imageUrl,
                    })),
                  },
                },
              })),
            },
          },
          include: {
            category: true,
            variants: {
              include: {
                additionalImages: true,
              },
            },
          },
        });

        res.status(200).json(updatedProduct);
      } catch (error) {
        console.error(`Error updating product ${productId}:`, error);
        res.status(500).json({ error: `Failed to update product ${productId}` });
      }
      break;

    case 'DELETE':
      try {
        await prisma.product.delete({
          where: { id: productId },
        });
        res.status(204).end();
      } catch (error) {
        console.error(`Error deleting product ${productId}:`, error);
        res.status(500).json({ error: `Failed to delete product ${productId}` });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).json({ message: `Method ${method} not allowed` });
      break;
  }
}
