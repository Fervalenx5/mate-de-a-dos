'use client';

import { useProductStore } from '@/stores/useProductStore';
import ProductCard from '../product/ProductCard';

export default function NewArrivals() {
  const products = useProductStore((s) => s.products);
  const newProducts = products.filter(p => p.active && p.isNew).slice(0, 4);

  if (newProducts.length === 0) return null;

  return (
    <section className="py-20 bg-blanco">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-medium text-verde mb-4">Novedades</h2>
          <p className="text-gris-texto">Descubrí las últimas incorporaciones a nuestra colección.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
