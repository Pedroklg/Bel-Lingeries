import { ProductVariant as ModelProductVariant, AdditionalImage as ModelAdditionalImage } from '../types/models';
import { APIProductVariant as ApiProductVariant, APIAdditionalImage as ApiAdditionalImage } from '../types/api';

const mapApiAdditionalImageToModel = (apiImage: ApiAdditionalImage): ModelAdditionalImage => ({
  id: apiImage.id,
  imageUrl: apiImage.imageUrl,
});

export const mapApiProductVariantToModel = (apiVariant: ApiProductVariant): ModelProductVariant => ({
  id: apiVariant.id,
  productId: apiVariant.productId,
  color: apiVariant.color,
  size: apiVariant.size,
  stock: apiVariant.stock,
  frontImage: apiVariant.frontImage,
  backImage: apiVariant.backImage,
  additionalImages: apiVariant.additionalImages.map(mapApiAdditionalImageToModel), // Map each APIAdditionalImage to ModelAdditionalImage
});
