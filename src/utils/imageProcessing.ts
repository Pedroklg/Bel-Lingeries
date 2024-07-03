import cloudinary from '../lib/cloudinaryConfig';
import sharp from 'sharp';

export async function processAndStoreImage(file: Buffer, folder: string): Promise<string> {
  try {
    const resizedImageBuffer = await sharp(file)
      .resize({ width: 800, height: 600 })
      .jpeg({ quality: 90 })
      .toBuffer();

    const base64Image = resizedImageBuffer.toString('base64');

    const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${base64Image}`, { folder });

    return result.secure_url;
  } catch (error) {
    console.error('Error processing and storing image:', error);
    throw new Error('Failed to process and store image');
  }
}

export async function deleteImageFromCloudinary(url: string): Promise<void> {
  const extractPublicId = (url: string) => {
    const parts = url.split('/');
    const publicIdWithExtension = parts[parts.length - 1].split('.')[0];
    return publicIdWithExtension;
  };

  if (url) {
    const publicId = extractPublicId(url);
    await cloudinary.uploader.destroy(publicId);
  }
}