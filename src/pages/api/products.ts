import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Route to get all products
      if (req.query.type === 'all') {
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
        return res.status(200).json(products);
      }
      // Route to get newest products
      else if (req.query.type === 'newest') {
        const limit = Number(req.query.limit) || 5;
        const products = await prisma.product.findMany({
          take: limit,
          orderBy: {
            createdAt: 'desc',
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
        return res.status(200).json(products);
      }
      else if (req.query.type === 'best-sellers') {
        const limit = Number(req.query.limit) || 5;
        const products = await prisma.product.findMany({
          take: limit,
          orderBy: {
            soldCount: 'desc',
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
        return res.status(200).json(products);
      }
      // Method not allowed for other queries on GET
      else {
        return res.setHeader('Allow', ['GET']).status(405).end(`Method ${req.method} Not Allowed`);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, description, price, categories, variants } = req.body;

      if (!name || !description || !price || !categories || !variants) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

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
              color: variant.color,
              size: variant.size,
              stock: variant.stock,
              frontImage: variant.frontImage,
              backImage: variant.backImage,
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

      return res.status(201).json(createdProduct);
    } catch (error) {
      console.error('Error creating product:', error);
      return res.status(500).json({ error: 'Failed to create product' });
    }
  } else {
    return res.setHeader('Allow', ['GET', 'POST']).status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
