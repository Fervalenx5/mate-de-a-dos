'use client';

import { useEffect } from 'react';
import { useProductStore } from '@/stores/useProductStore';
import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import NewArrivals from '@/components/home/NewArrivals';

export default function Home() {
  const fetchProducts = useProductStore((s) => s.fetchProducts);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="flex flex-col">
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <NewArrivals />
    </div>
  );
}
