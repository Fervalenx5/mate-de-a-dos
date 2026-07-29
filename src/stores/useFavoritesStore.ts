'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesStore {
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      toggleFavorite: (productId) => {
        const favs = get().favorites;
        if (favs.includes(productId)) {
          set({ favorites: favs.filter((id) => id !== productId) });
        } else {
          set({ favorites: [...favs, productId] });
        }
      },

      isFavorite: (productId) => get().favorites.includes(productId),

      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: 'mate-favorites',
    }
  )
);
