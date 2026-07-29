'use client';

import { useProductStore } from '@/stores/useProductStore';
import ProductCard from '../product/ProductCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function FeaturedProducts() {
  const products = useProductStore((s) => s.products);
  const featuredProducts = products.filter(p => p.active && p.featured).slice(0, 4);

  if (featuredProducts.length === 0) return null;

  return (
    <section className="py-20 bg-beige/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-display font-medium text-verde mb-2">Productos Destacados</h2>
            <p className="text-gris-texto">Nuestra selección curada para vos.</p>
          </div>
          <Link
            href="/catalogo"
            className="group flex items-center gap-2 text-dorado font-medium hover:text-verde transition-colors"
          >
            Ver todo el catálogo
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
