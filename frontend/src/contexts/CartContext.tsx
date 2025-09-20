/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { SuperpowerCapsule, FuturisticMachine } from '../types';

type Product = SuperpowerCapsule | FuturisticMachine;

interface CartItem {
  product: Product;
  productType: 'capsule' | 'machine';
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  total: number;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

export const CartContext = createContext<CartContextType | null>(null);

interface CartProviderProps {
  children: ReactNode;
}

// Generate or get session ID
const getSessionId = () => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const sessionId = getSessionId();

  // Calculate derived values
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const loadCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await cartAPI.getCart(sessionId);
      if (response.success) {
        setItems(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const addToCart = async (product: Product, quantity: number = 1) => {
    try {
      setIsLoading(true);
      const productWithType = {
        ...product,
        productType: product.superpower ? 'capsule' : 'machine'
      };

      const response = await cartAPI.addToCart(sessionId, productWithType, quantity);
      if (response.success) {
        setItems(response.data || []);
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      setIsLoading(true);
      const response = await cartAPI.updateCart(sessionId, productId, quantity);
      if (response.success) {
        setItems(response.data || []);
      }
    } catch (error) {
      console.error('Failed to update cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      setIsLoading(true);
      const response = await cartAPI.removeFromCart(sessionId, productId);
      if (response.success) {
        setItems(response.data || []);
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setIsLoading(true);
      await cartAPI.clearCart(sessionId);
      setItems([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const value: CartContextType = {
    items,
    itemCount,
    total,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isLoading,
    isCartOpen,
    openCart,
    closeCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};