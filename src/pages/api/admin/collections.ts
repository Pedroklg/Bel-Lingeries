import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import authMiddleware from '../../../middleware/authMiddleware';
import { processAndStoreImage, deleteImageFromCloudinary } from '../../../utils/imageProcessing';

const handler = async (req: NextApiRequest & { file?: any }, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case 'GET':
        const collections = await prisma.collection.findMany({
          include: {
            products: true,
          },
        });
        res.status(200).json(collections);
        break;
      case 'POST':
        const { name } = req.body;
        let imageUrl = null;

        if (req.file) {
          imageUrl = await processAndStoreImage(req.file.buffer, 'collections');
        }

        const newCollection = await prisma.collection.create({
          data: {
            name,
            image: imageUrl || '',
          },
        });

        res.status(201).json(newCollection);
        break;
      case 'PUT':
        const { id, updatedName } = req.body;
        let updatedImageUrl = null;

        if (req.file) {
          updatedImageUrl = await processAndStoreImage(req.file.buffer, 'collections');
        }

        const updatedCollection = await prisma.collection.update({
          where: { id: parseInt(id) },
          data: {
            name: updatedName,
            image: updatedImageUrl || '',
          },
        });

        res.status(200).json(updatedCollection);
        break;
      case 'DELETE':
        const { deleteId } = req.body;

        const collectionToDelete = await prisma.collection.findUnique({
          where: { id: parseInt(deleteId) },
        });

        if (collectionToDelete?.image) {
          await deleteImageFromCloudinary(collectionToDelete.image);
        }

        const deletedCollection = await prisma.collection.delete({
          where: { id: parseInt(deleteId) },
        });

        res.status(200).json(deletedCollection);
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

export const config = {
  api: {
    bodyParser: false,
  },
};