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
            const formatted: Product[] = data.map((item: any) => ({
              id: String(item.id),
              name: item.name,
              slug: item.slug,
              description: item.description || '',
              price: Number(item.price),
              category: item.category || 'mates',
              material: item.material || 'Aluminio / Madera',
              colors: item.colors || [],
              capacity: item.capacity || undefined,
              images: item.images || [],
              featured: item.featured ?? false,
              isNew: item.is_new ?? item.isNew ?? false,
              active: item.active ?? true,
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
          // Si el ID es un string manual o temporal de JS, dejamos que Supabase lo inserte o ignore si rechaza el id
          const payload: Record<string, any> = {
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
            category: product.category,
            material: product.material,
            images: product.images,
            colors: product.colors,
            capacity: product.capacity ?? null,
            is_new: product.isNew ?? false,
            active: product.active ?? true,
            featured: product.featured ?? false,
            in_stock: product.inStock ?? true,
            created_at: product.createdAt ?? new Date().toISOString(),
          };
          
          // Solo enviar ID si no empieza con manual-
          if (!product.id.startsWith('manual-')) {
            payload.id = product.id;
          }

          const { error } = await supabase.from('products').insert([payload]);
          if (error) {
            console.error('Error al insertar producto en Supabase:', error.message);
            // Si falla el insert con error de ID existente, probar upsert
            await supabase.from('products').upsert([payload]);
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
            const dbData: Record<string, any> = {};
            if (data.name !== undefined) dbData.name = data.name;
            if (data.price !== undefined) dbData.price = data.price;
            if (data.description !== undefined) dbData.description = data.description;
            if (data.material !== undefined) dbData.material = data.material;
            if (data.capacity !== undefined) dbData.capacity = data.capacity;
            if (data.active !== undefined) dbData.active = data.active;
            if (data.featured !== undefined) dbData.featured = data.featured;
            if (data.isNew !== undefined) dbData.is_new = data.isNew;
            if (data.inStock !== undefined) dbData.in_stock = data.inStock;
            if (data.category !== undefined) dbData.category = data.category;
            if (data.images !== undefined) dbData.images = data.images;
            if (data.colors !== undefined) dbData.colors = data.colors;

            const { error } = await supabase.from('products').update(dbData).eq('id', id);
            if (error) {
              console.error('Supabase update error:', error.message);
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
