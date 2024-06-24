export interface User {
  id: number;
  email: string;
  name?: string;
  password: string;
  orders: Order[];
  cart: CartItem[];
  isAdmin: boolean;
}

export interface CartItem {
  variant: ProductVariant;
  quantity: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  variants: ProductVariant[];
  categoryId?: number;
  collectionId?: number;
}

export interface ProductVariant {
  id: number;
  productId: number;
  color: string;
  size: string;
  stock: number;
  frontImage: string;
  backImage: string;
  additionalImages: AdditionalImage[];
  quantity?: number;
}

export interface AdditionalImage {
  id: number;
  imageUrl: string;
}

export interface Order {
  id: number;
  userId: number;
  createdAt: Date;
  items: OrderItem[];
  total: number;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
}

export interface Category {
  id: number;
  name: string;
  products: Product[];
}

export interface Collection {
  id: number;
  name: string;
  image: string;
  products: Product[];
}
