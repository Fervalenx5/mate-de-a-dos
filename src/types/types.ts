// ============================================
// MATE DE A DOS — Type Definitions
// ============================================

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  category: string;
  material: string;
  colors: ColorOption[];
  capacity?: string;
  images: string[];
  featured: boolean;
  isNew: boolean;
  active: boolean;
  inStock: boolean;
  createdAt: string;
  // Future automation fields
  externalId?: string;
  supplier?: string;
  lastSyncedAt?: string;
}

export interface ColorOption {
  name: string;
  hex: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  order: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: ColorOption;
}

export interface CheckoutData {
  name: string;
  phone: string;
  observations: string;
}

export type FilterState = {
  category: string;
  priceRange: [number, number];
  materials: string[];
  colors: string[];
  search: string;
};
