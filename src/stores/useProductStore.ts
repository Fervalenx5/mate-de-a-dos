'use client';

import { create } from 'zustand';
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

export const useProductStore = create<ProductStore>()((set, get) => ({
      products: initialProducts,
      categories: defaultCategories,
      isAdminAuthenticated: false,
      loading: false,

      fetchProducts: async () => {
        try {
          set({ loading: true });
          const { data, error } = await supabase.from('products').select('*');
          if (!error && data && data.length > 0) {
            const formatted = data.map((item: any) => ({
              id: item.id,
              name: item.name,
              slug: item.slug,
              description: item.description || '',
              price: Number(item.price),
              originalPrice: item.original_price ?? item.originalPrice ?? undefined,
              category: item.category,
              images: item.images || [],
              colors: item.colors || [],
              badge: item.badge || undefined,
              isNew: item.is_new ?? item.isNew ?? false,
              active: item.active ?? true,
              featured: item.featured ?? false,
              inStock: item.in_stock ?? item.inStock ?? true,
              createdAt: item.created_at ?? item.createdAt ?? new Date().toISOString(),
            }));
            set({ products: formatted, categories: defaultCategories });
          } else {
            set({ products: initialProducts, categories: defaultCategories });
          }
        } catch (e) {
          console.log('Using local fallback:', e);
          set({ products: initialProducts, categories: defaultCategories });
        } finally {
          set({ loading: false });
        }
      },

      addProduct: async (product) => {
        const updated = [...get().products, product];
        set({ products: updated });
        try {
          const payload = {
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
            original_price: product.originalPrice ?? null,
            category: product.category,
            images: product.images,
            colors: product.colors,
            badge: product.badge ?? null,
            is_new: product.isNew ?? false,
            active: product.active ?? true,
            featured: product.featured ?? false,
            in_stock: product.inStock ?? true,
            created_at: product.createdAt ?? new Date().toISOString(),
          };
          const { error } = await supabase.from('products').upsert([payload]);
          if (error) {
            console.error('Error al guardar producto en Supabase:', error.message);
          } else {
            await get().fetchProducts();
          }
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
            const payload = {
              id: target.id,
              name: target.name,
              slug: target.slug,
              description: target.description,
              price: target.price,
              original_price: target.originalPrice ?? null,
              category: target.category,
              images: target.images,
              colors: target.colors,
              badge: target.badge ?? null,
              is_new: target.isNew ?? false,
              active: target.active ?? true,
              featured: target.featured ?? false,
              in_stock: target.inStock ?? true,
            };
            const { error } = await supabase.from('products').upsert([payload]);
            if (error) {
              console.error('Supabase upsert error:', error.message);
            } else {
              await get().fetchProducts();
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
          const { error } = await supabase.from('products').delete().eq('id', id);
          if (error) {
            console.error('Supabase delete error:', error.message);
          }
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
    })
);
