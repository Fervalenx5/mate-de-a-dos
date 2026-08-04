'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Product } from '@/types/types';
import { formatPrice } from '@/lib/utils';
import { useFavoritesStore } from '@/stores/useFavoritesStore';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const [imageLoaded, setImageLoaded] = useState(false);

  const favorite = isFavorite(product.id);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-blanco rounded-2xl p-4 shadow-sm hover:shadow-card-hover transition-all duration-300 relative border border-gris-medio/50 flex flex-col h-full"
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.isNew && (
          <span className="bg-dorado text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            Nuevo
          </span>
        )}
      </div>

      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(product.id);
        }}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform"
        aria-label="Agregar a favoritos"
      >
        <Heart
          size={18}
          className={`transition-colors ${favorite ? 'fill-dorado text-dorado' : 'text-gris-texto hover:text-dorado'}`}
        />
      </button>

      {/* Image */}
      <Link href={`/producto/${product.slug}`} className="block relative aspect-square mb-4 rounded-xl overflow-hidden bg-gris-claro">
        <Image
          src={product.images && product.images[0] ? product.images[0] : '/images/products/termo-negro.png'}
          alt={product.name}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-grow">
        <Link href={`/producto/${product.slug}`} className="flex-grow">
          <p className="text-xs text-gris-texto uppercase tracking-wider mb-1">
            {product.category}
          </p>
          <h3 className="font-display font-medium text-verde text-lg leading-tight mb-2 group-hover:text-dorado transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-auto pt-4">
          <p className="text-dorado font-semibold text-lg">
            {formatPrice(product.price)}
          </p>
          <Link
            href={`/producto/${product.slug}`}
            className="text-xs font-semibold uppercase tracking-wider text-verde hover:text-dorado bg-beige hover:bg-beige/50 px-4 py-2 rounded-full transition-colors"
          >
            Ver
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
