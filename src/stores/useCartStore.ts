'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, ColorOption } from '@/types/types';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: ColorOption;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number, color?: ColorOption) => void;
  removeItem: (productId: string, colorHex?: string) => void;
  updateQuantity: (productId: string, quantity: number, colorHex?: string) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  getTotalItems: () => number;
  getItemCount: () => number;
  getTotalPrice: () => number;
  toggleCart: () => void;
}

// Helper to create a unique key for a cart item (product + color combo)
function getItemKey(productId: string, colorHex?: string): string {
  return colorHex ? `${productId}__${colorHex}` : productId;
}

function matchItem(item: CartItem, productId: string, colorHex?: string): boolean {
  const itemColorHex = item.selectedColor?.hex;
  if (colorHex) {
    return item.product.id === productId && itemColorHex === colorHex;
  }
  return item.product.id === productId && !itemColorHex;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1, color) => {
        set((state) => {
          const existingItem = state.items.find((item) =>
            matchItem(item, product.id, color?.hex)
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                matchItem(item, product.id, color?.hex)
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
              isOpen: true,
            };
          }

          return {
            items: [...state.items, { product, quantity, selectedColor: color }],
            isOpen: true,
          };
        });
      },

      removeItem: (productId, colorHex) => {
        set((state) => ({
          items: state.items.filter((item) => !matchItem(item, productId, colorHex)),
        }));
      },

      updateQuantity: (productId, quantity, colorHex) => {
        set((state) => ({
          items: state.items.map((item) =>
            matchItem(item, productId, colorHex) ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      setIsOpen: (isOpen) => {
        set({ isOpen });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },
    }),
    {
      name: 'mate-cart',
      partialize: (state) => ({ items: state.items }), // Only persist items, not isOpen state
    }
  )
);
