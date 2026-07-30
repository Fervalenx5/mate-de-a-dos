'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, Category } from '@/types/types';
import { initialProducts, categories as defaultCategories } from '@/data/products';

interface ProductStore {
  products: Product[];
  categories: Category[];
  isAdminAuthenticated: boolean;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductActive: (id: string) => void;
  toggleProductFeatured: (id: string) => void;
  toggleProductNew: (id: string) => void;
  addCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  authenticateAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  getActiveProducts: () => Product[];
  getProductsByCategory: (categorySlug: string) => Product[];
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
  getFeaturedProducts: () => Product[];
  getNewProducts: () => Product[];
  // Future: sync from external API
  syncFromAPI: () => Promise<void>;
}

const ADMIN_PASSWORD = 'matedeados2024';

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: initialProducts,
      categories: defaultCategories,
      isAdminAuthenticated: false,

      addProduct: (product) => {
        set({ products: [...get().products, product] });
      },

      updateProduct: (id, data) => {
        set({
          products: get().products.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        });
      },

      deleteProduct: (id) => {
        set({ products: get().products.filter((p) => p.id !== id) });
      },

      toggleProductActive: (id) => {
        set({
          products: get().products.map((p) =>
            p.id === id ? { ...p, active: !p.active } : p
          ),
        });
      },

      toggleProductFeatured: (id) => {
        set({
          products: get().products.map((p) =>
            p.id === id ? { ...p, featured: !p.featured } : p
          ),
        });
      },

      toggleProductNew: (id) => {
        set({
          products: get().products.map((p) =>
            p.id === id ? { ...p, isNew: !p.isNew } : p
          ),
        });
      },

      addCategory: (category) => {
        set({ categories: [...get().categories, category] });
      },

      deleteCategory: (id) => {
        set({ categories: get().categories.filter((c) => c.id !== id) });
      },

      authenticateAdmin: (password) => {
        const isValid = password === ADMIN_PASSWORD;
        if (isValid) {
          set({ isAdminAuthenticated: true });
        }
        return isValid;
      },

      logoutAdmin: () => set({ isAdminAuthenticated: false }),

      getActiveProducts: () => get().products.filter((p) => p.active),

      getProductsByCategory: (categorySlug) =>
        get().products.filter((p) => p.active && p.category === categorySlug),

      getProductBySlug: (slug) =>
        get().products.find((p) => p.slug === slug),

      getProductById: (id) =>
        get().products.find((p) => p.id === id),

      getFeaturedProducts: () =>
        get().products.filter((p) => p.active && p.featured),

      getNewProducts: () =>
        get().products.filter((p) => p.active && p.isNew),

      syncFromAPI: async () => {
        // Placeholder for future API integration
        // This will connect to external providers/scrapers
        console.log('syncFromAPI: Ready for future implementation');
      },
    }),
    {
      name: 'mate-products-v2',
      partialize: (state) => ({
        products: state.products,
        categories: state.categories,
      }),
    }
  )
);
