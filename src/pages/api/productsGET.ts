import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
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
      } else if (req.query.id) {
        const product = await prisma.product.findUnique({
          where: {
            id: Number(req.query.id),
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
        return res.status(200).json(product);
      }
      else {
        return res.setHeader('Allow', ['GET']).status(405).end(`Method ${req.method} Not Allowed`);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
  }
  else {
    return res.setHeader('Allow', ['GET']).status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
