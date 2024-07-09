import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import authMiddleware from '../../../../middleware/authMiddleware';
import { deleteImageFromCloudinary, processAndStoreImage } from '../../../../utils/imageProcessing';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      try {
        const productVariant = await prisma.productVariant.findUnique({
          where: { id: Number(id) },
          include: { additionalImages: true },
        });

        if (!productVariant) {
          return res.status(404).json({ message: 'Product variant not found' });
        }

        return res.status(200).json(productVariant);
      } catch (error) {
        console.error('Error fetching product variant:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

    case 'PUT':
      try {
        const { color: updatedColor, size: updatedSize, stock: updatedStock } = req.body;

        const currentProductVariant = await prisma.productVariant.findUnique({
          where: { id: Number(id) },
          include: { additionalImages: true },
        });

        if (!currentProductVariant) {
          return res.status(404).json({ message: 'Product variant not found' });
        }

        let updatedFrontImageUrl = currentProductVariant.frontImage;
        let updatedBackImageUrl = currentProductVariant.backImage;
        const updatedAdditionalImagesUrls = [];
        let deletedImages = [];

        if (req.body?.frontImage && Array.isArray(req.body.frontImage) && req.body.frontImage.length > 0 && req.body.frontImage[0]?.buffer) {
          updatedFrontImageUrl = await processAndStoreImage(req.body.frontImage[0].buffer, 'product_variants');
          // Delete previous front image from Cloudinary
          if (currentProductVariant.frontImage) {
            await deleteImageFromCloudinary(currentProductVariant.frontImage);
          }
        }

        // Process and store updated back image if provided
        if (req.body?.backImage && Array.isArray(req.body.backImage) && req.body.backImage.length > 0 && req.body.backImage[0]?.buffer) {
          updatedBackImageUrl = await processAndStoreImage(req.body.backImage[0].buffer, 'product_variants');
          // Delete previous back image from Cloudinary
          if (currentProductVariant.backImage) {
            await deleteImageFromCloudinary(currentProductVariant.backImage);
          }
        }

        // Process and store updated additional images if provided
        if (req.body?.additionalImages) {
          for (const file of req.body.additionalImages) {
            const url = await processAndStoreImage(file.buffer, 'product_variants');
            updatedAdditionalImagesUrls.push(url);
          }

          // Delete previous additional images from Cloudinary
          for (const image of currentProductVariant.additionalImages) {
            if (image.imageUrl && !updatedAdditionalImagesUrls.includes(image.imageUrl)) {
              deletedImages.push(image.imageUrl);
              await deleteImageFromCloudinary(image.imageUrl);
            }
          }
        }

        // Update the product variant in the database
        const updatedProductVariant = await prisma.productVariant.update({
          where: { id: Number(id) },
          data: {
            color: updatedColor || currentProductVariant.color,
            size: updatedSize || currentProductVariant.size,
            stock: updatedStock ? Number(updatedStock) : currentProductVariant.stock,
            frontImage: updatedFrontImageUrl || '',
            backImage: updatedBackImageUrl || '',
            additionalImages: {
              create: updatedAdditionalImagesUrls.map(url => ({ imageUrl: url })), // Add new additional images
              deleteMany: deletedImages.map(url => ({ imageUrl: url })), // Delete old additional images
            },
          },
          include: {
            additionalImages: true,
          },
        });

        console.log('Variant saved:', updatedProductVariant); // Debug log for confirmation

        return res.status(200).json(updatedProductVariant);
      } catch (error) {
        console.error('Error updating product variant:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
};

export default authMiddleware(handler, true); // true if admin access is required