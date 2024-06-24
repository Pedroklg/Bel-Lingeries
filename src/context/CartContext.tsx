import React, { createContext, useContext, useReducer } from 'react';
import { Product, ProductVariant } from '../types/models';

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  removeFromCart: (productId: number, variantId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});

const cartReducer = (state: CartItem[], action: any): CartItem[] => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItemIndex = state.findIndex(
        (item) => item.variant.id === action.variant.id
      );
      if (existingItemIndex !== -1) {
        const updatedItems = [...state];
        updatedItems[existingItemIndex].quantity += action.quantity;
        return updatedItems;
      } else {
        return [
          ...state,
          { product: action.product, variant: action.variant, quantity: action.quantity },
        ];
      }
    case 'REMOVE_FROM_CART':
      return state.filter(
        (item) => !(item.product.id === action.productId && item.variant.id === action.variantId)
      );
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, []);

  const addToCart = (product: Product, variant: ProductVariant, quantity: number) => {
    dispatch({ type: 'ADD_TO_CART', product, variant, quantity });
  };

  const removeFromCart = (productId: number, variantId: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', productId, variantId });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);