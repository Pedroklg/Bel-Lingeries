import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import prisma from '../../../lib/prisma';
import authMiddleware from '../../../middleware/authMiddleware';
import { processAndStoreImage } from '../../../utils/imageProcessing';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

(upload.fields([
  { name: 'frontImage', maxCount: 1 },
  { name: 'backImage', maxCount: 1 },
  { name: 'additionalImages', maxCount: 9 },
]));

const handler = async (req: NextApiRequest & { files?: any }, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      if (req.query.productId) {
        const productVariants = await prisma.productVariant.findMany({
          where: {
            productId: Number(req.query.productId),
          }
        });
        return res.status(200).json(productVariants);
      } else {
        const productVariants = await prisma.productVariant.findMany({
          include: {
            additionalImages: true,
            product: true,
          },
        });
        return res.status(200).json(productVariants);
      }
    case 'POST':
      const { color, size, stock, productId } = req.body;

      let frontImageUrl = null;
      let backImageUrl = null;
      const additionalImagesUrls = [];

      if (req.files.frontImage) {
        frontImageUrl = await processAndStoreImage(req.files.frontImage[0].buffer, 'product_variants');
      }

      if (req.files.backImage) {
        backImageUrl = await processAndStoreImage(req.files.backImage[0].buffer, 'product_variants');
      }

      if (req.files.additionalImages) {
        for (const file of req.files.additionalImages) {
          const url = await processAndStoreImage(file.buffer, 'product_variants');
          additionalImagesUrls.push(url);
        }
      }

      const productVariant = await prisma.productVariant.create({
        data: {
          color,
          size,
          stock: Number(stock),
          productId: Number(productId),
          frontImage: frontImageUrl || '',
          backImage: backImageUrl || '',
          additionalImages: {
            create: additionalImagesUrls.map(url => ({ imageUrl: url })),
          },
        },
        include: {
          additionalImages: true,
        },
      });

      return res.status(201).json(productVariant);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
};

export default authMiddleware(handler, true);