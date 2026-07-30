'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, Category } from '@/types/types';
import { initialProducts, categories as defaultCategories } from '@/data/products';
import { supabase } from '@/lib/supabase';

interface ProductStore {
  products: Product[];
  categories: Category[];
  isAdminAuthenticated: boolean;
  loading: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleProductActive: (id: string) => Promise<void>;
  toggleProductFeatured: (id: string) => Promise<void>;
  toggleProductNew: (id: string) => Promise<void>;
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
}

const ADMIN_PASSWORD = 'matedeados2024';

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: initialProducts,
      categories: defaultCategories,
      isAdminAuthenticated: false,
      loading: false,

      fetchProducts: async () => {
        try {
          set({ loading: true });
          const { data, error } = await supabase.from('products').select('*');
          if (!error && data && data.length > 0) {
            const dbMap = new Map(data.map((item: Product) => [item.id, item]));
            const merged = get().products.map((p) => dbMap.get(p.id) || p);
            
            data.forEach((item: Product) => {
              if (!merged.some((p) => p.id === item.id)) {
                merged.push(item);
              }
            });
            
            set({ products: merged });
          }
        } catch (e) {
          console.log('Using local fallback:', e);
        } finally {
          set({ loading: false });
        }
      },

      addProduct: async (product) => {
        const updated = [...get().products, product];
        set({ products: updated });
        try {
          await supabase.from('products').upsert([product]);
        } catch (e) {
          console.log('Error syncing to Supabase:', e);
        }
      },

      updateProduct: async (id, data) => {
        const updated = get().products.map((p) => (p.id === id ? { ...p, ...data } : p));
        set({ products: updated });
        try {
          const target = updated.find((p) => p.id === id);
          if (target) {
            const { error } = await supabase.from('products').upsert([target]);
            if (error) {
              console.error('Supabase upsert error:', error.message);
            }
          }
        } catch (e) {
          console.log('Error updating in Supabase:', e);
        }
      },

      deleteProduct: async (id) => {
        const updated = get().products.filter((p) => p.id !== id);
        set({ products: updated });
        try {
          await supabase.from('products').delete().eq('id', id);
        } catch (e) {
          console.log('Error deleting in Supabase:', e);
        }
      },

      toggleProductActive: async (id) => {
        const target = get().products.find((p) => p.id === id);
        if (!target) return;
        const newActive = !target.active;
        await get().updateProduct(id, { active: newActive });
      },

      toggleProductFeatured: async (id) => {
        const target = get().products.find((p) => p.id === id);
        if (!target) return;
        const newFeatured = !target.featured;
        await get().updateProduct(id, { featured: newFeatured });
      },

      toggleProductNew: async (id) => {
        const target = get().products.find((p) => p.id === id);
        if (!target) return;
        const newIsNew = !target.isNew;
        await get().updateProduct(id, { isNew: newIsNew });
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
    }),
    {
      name: 'mate-products-v5',
      partialize: (state) => ({
        products: state.products,
        categories: state.categories,
      }),
    }
  )
);
