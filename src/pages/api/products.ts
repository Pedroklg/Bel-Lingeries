import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Route to get all products
    if (req.query.type === 'all') {
      try {
        const products = await prisma.product.findMany({
          include: {
            category: true,
            variants: {
              include: {
                additionalImages: true,
              },
            },
          },
        });
        res.status(200).json(products);
      } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
      }
    }
    // Route to get newest products
    else if (req.query.type === 'newest') {
      const limit = Number(req.query.limit) || 5;
      try {
        const products = await prisma.product.findMany({
          take: limit,
          include: {
            category: true,
            variants: {
              include: {
                additionalImages: true,
              },
            },
          },
        });
        res.status(200).json(products);
      } catch (error) {
        console.error('Error fetching newest products:', error);
        res.status(500).json({ message: 'Failed to fetch newest products' });
      }
    }
    // Method not allowed for other queries on GET
    else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } else if (req.method === 'POST') {
    try {
      const { name, description, price, categories, variants } = req.body;

      const createdProduct = await prisma.product.create({
        data: {
          name,
          description,
          price,
          category: {
            connect: categories.map((categoryId: number) => ({ id: categoryId })),
          },
          variants: {
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

      res.status(201).json(createdProduct);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
