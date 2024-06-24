import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const parsedId = parseInt(id as string);

    try {
        // Verify if the categoryId is valid
        const validCategoryIds = [1, 2, 3, 4];
        if (!validCategoryIds.includes(parsedId)) {
            return res.status(404).json({ error: `Category with ID ${parsedId} not found` });
        }

        // Fetch products from the database using Prisma
        const products = await prisma.product.findMany({
            where: {
                categoryId: parsedId,
            },
        });

        res.status(200).json(products);
    } catch (error) {
        console.error(`Error fetching products for category with ID ${parsedId}:`, error);
        res.status(500).json({ error: `Failed to fetch products for category with ID ${parsedId}` });
    }
}
