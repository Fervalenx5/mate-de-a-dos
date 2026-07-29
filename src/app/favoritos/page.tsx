'use client';

import { useFavoritesStore } from '@/stores/useFavoritesStore';
import { useProductStore } from '@/stores/useProductStore';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';

export default function FavoritosPage() {
  const favorites = useFavoritesStore((s) => s.favorites);
  const products = useProductStore((s) => s.products);

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-verde/10">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-verde flex items-center gap-3">
            <Heart className="fill-dorado text-dorado" size={32} /> Mis Favoritos
          </h1>
          <p className="text-gris-texto text-sm sm:text-base mt-1">
            Guarda tus mates y productos preferidos para comprarlos cuando quieras.
          </p>
        </div>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-24 h-24 rounded-full bg-verde/5 flex items-center justify-center text-verde/30">
            <Heart size={48} />
          </div>
          <h2 className="font-heading text-xl font-semibold text-verde">Aún no tenés productos favoritos</h2>
          <p className="text-gris-texto text-sm max-w-md">
            Explora nuestro catálogo y tocá el icono de corazón en los mates que más te gusten.
          </p>
          <Link
            href="/catalogo"
            className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-verde text-white font-medium rounded-xl hover:bg-dorado transition-colors shadow-lg shadow-verde/10"
          >
            Ir al Catálogo <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
