import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import prisma from '../../../../lib/prisma';
import authMiddleware from '../../../../middleware/authMiddleware';
import { deleteImageFromCloudinary, processAndStoreImage } from '../../../../utils/imageProcessing';

// Multer setup
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

upload.fields([
  { name: 'frontImage', maxCount: 1 },
  { name: 'backImage', maxCount: 1 },
  { name: 'additionalImages', maxCount: 9 },
]);

const handler = async (req: NextApiRequest & { files?: any }, res: NextApiResponse) => {
  const { id } = req.query; // Retrieve id from query parameters

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
      const { updatedColor, updatedSize, updatedStock, updatedProductId } = req.body;

      try {
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

        // Process and store updated front image if provided
        if (req.files?.frontImage) {
          updatedFrontImageUrl = await processAndStoreImage(req.files.frontImage[0].buffer, 'product_variants');
          // Delete previous front image from Cloudinary
          if (currentProductVariant.frontImage) {
            await deleteImageFromCloudinary(currentProductVariant.frontImage);
          }
        }

        // Process and store updated back image if provided
        if (req.files?.backImage) {
          updatedBackImageUrl = await processAndStoreImage(req.files.backImage[0].buffer, 'product_variants');
          // Delete previous back image from Cloudinary
          if (currentProductVariant.backImage) {
            await deleteImageFromCloudinary(currentProductVariant.backImage);
          }
        }

        // Process and store updated additional images if provided
        if (req.files?.additionalImages) {
          for (const file of req.files.additionalImages) {
            const url = await processAndStoreImage(file.buffer, 'product_variants');
            updatedAdditionalImagesUrls.push(url);
          }

          // Delete previous additional images from Cloudinary
          for (const image of currentProductVariant.additionalImages) {
            await deleteImageFromCloudinary(image.imageUrl);
          }
        }

        // Update the product variant in the database
        const updatedProductVariant = await prisma.productVariant.update({
          where: { id: Number(id) },
          data: {
            color: updatedColor,
            size: updatedSize,
            stock: Number(updatedStock),
            productId: Number(updatedProductId),
            frontImage: updatedFrontImageUrl || '',
            backImage: updatedBackImageUrl || '',
            additionalImages: {
              deleteMany: {},
              create: updatedAdditionalImagesUrls.map(url => ({ imageUrl: url })),
            },
          },
          include: {
            additionalImages: true,
          },
        });

        return res.status(200).json(updatedProductVariant);
      } catch (error) {
        console.error('Error updating product variant:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

    case 'DELETE':
      try {
        const productVariantToDelete = await prisma.productVariant.findUnique({
          where: { id: Number(id) },
          include: { additionalImages: true },
        });

        if (!productVariantToDelete) {
          return res.status(404).json({ message: 'Product variant not found' });
        }

        // Delete images associated with the product variant from Cloudinary
        if (productVariantToDelete.frontImage) {
          await deleteImageFromCloudinary(productVariantToDelete.frontImage);
        }

        if (productVariantToDelete.backImage) {
          await deleteImageFromCloudinary(productVariantToDelete.backImage);
        }

        for (const image of productVariantToDelete.additionalImages) {
          await deleteImageFromCloudinary(image.imageUrl);
        }

        // Delete the product variant from the database
        const deletedProductVariant = await prisma.productVariant.delete({
          where: { id: Number(id) },
        });

        return res.status(200).json(deletedProductVariant);
      } catch (error) {
        console.error('Error deleting product variant:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
};

export default authMiddleware(handler, true);