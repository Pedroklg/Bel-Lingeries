export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  variants: APIProductVariant[];
  categoryId?: number;
  collectionId?: number;
  createdAt: Date;
  soldCount: number;
}

export interface APIProductVariant {
  id: number;
  productId: number;
  color: string;
  size: string;
  stock: number;
  frontImage: string;
  backImage: string;
  additionalImages: APIAdditionalImage[]
}

export interface APIAdditionalImage {
  id: number;
  imageUrl: string;
}

export interface ProductColor {
  color: string;
  frontImage: string;
  backImage: string;
  additionalImages: string[];
}

export interface ProductSize {
  size: string;
  stock: number;
}

export interface FullProductVariant {
  color: ProductColor;
  sizes: ProductSize[];
}