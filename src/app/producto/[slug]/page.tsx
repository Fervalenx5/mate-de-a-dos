'use client';

import { useParams, useRouter } from 'next/navigation';
import { useProductStore } from '@/stores/useProductStore';
import { useCartStore } from '@/stores/useCartStore';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { ShoppingBag, Heart, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ColorOption } from '@/types/types';
import { useFavoritesStore } from '@/stores/useFavoritesStore';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  const getProductBySlug = useProductStore((s) => s.getProductBySlug);
  const product = getProductBySlug(slug);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedColor, setSelectedColor] = useState<ColorOption | undefined>(undefined);

  const addItem = useCartStore((s) => s.addItem);
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  // Auto-select first color if product has colors
  useEffect(() => {
    if (product && product.colors.length > 0 && !selectedColor) {
      setSelectedColor(product.colors[0]);
    }
  }, [product, selectedColor]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity, selectedColor);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-blanco flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-3xl font-display font-medium text-verde mb-4">Producto no encontrado</h1>
        <p className="text-gris-texto mb-8">El producto que estás buscando no existe o fue eliminado.</p>
        <button onClick={() => router.push('/catalogo')} className="bg-verde text-white px-8 py-3 rounded-xl font-medium hover:bg-dorado transition-colors">
          Volver al Catálogo
        </button>
      </div>
    );
  }

  const favorite = isFavorite(product.id);

  return (
    <div className="min-h-screen bg-blanco py-8 lg:py-16">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/catalogo" className="text-sm text-gris-texto hover:text-verde transition-colors flex items-center gap-1">
            <ChevronLeft size={16} /> Volver al catálogo
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Images Section */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-beige/30 border border-gris-medio">
              <Image
                src={product.images && product.images[activeImage] ? product.images[activeImage] : '/images/products/termo-negro.png'}
                alt={product.name}
                fill
                unoptimized
                className="object-cover"
                priority
              />
              {product.isNew && (
                <div className="absolute top-4 left-4 bg-dorado text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full z-10">
                  Nuevo
                </div>
              )}
            </div>
            
            {/* Gallery Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-colors ${activeImage === idx ? 'border-dorado' : 'border-transparent hover:border-gris-medio'}`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <h1 className="text-3xl lg:text-4xl font-display font-medium text-verde mb-4 leading-tight">
              {product.name}
            </h1>
            
            <p className="text-2xl font-bold text-dorado mb-8">
              {formatPrice(product.price)}
            </p>

            <div className="prose prose-p:text-gris-texto prose-p:leading-relaxed mb-10">
              <p>{product.description}</p>
            </div>

            {/* Color Selector */}
            {product.colors.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-verde mb-3">
                  Color: <span className="text-dorado">{selectedColor?.name || 'Seleccioná un color'}</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => setSelectedColor(color)}
                      className={`group relative w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                        selectedColor?.hex === color.hex
                          ? 'border-dorado scale-110 shadow-md'
                          : 'border-gris-medio hover:border-verde hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      aria-label={`Color ${color.name}`}
                      title={color.name}
                    >
                      {selectedColor?.hex === color.hex && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <Check
                            size={16}
                            className={`${
                              // Use white check on dark colors, dark check on light colors
                              isLightColor(color.hex) ? 'text-verde' : 'text-white'
                            } drop-shadow-sm`}
                          />
                        </motion.span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Specifications */}
            <div className="grid grid-cols-2 gap-y-4 mb-10 text-sm border-t border-b border-gris-medio py-6">
              {product.material && (
                <div>
                  <span className="block text-gris-texto mb-1">Material</span>
                  <span className="font-medium text-verde">{product.material}</span>
                </div>
              )}
              {product.category && (
                <div>
                  <span className="block text-gris-texto mb-1">Categoría</span>
                  <span className="font-medium text-verde capitalize">{product.category}</span>
                </div>
              )}
              <div>
                <span className="block text-gris-texto mb-1">Disponibilidad</span>
                <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
                  {product.inStock ? 'En stock' : 'Sin stock'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              {/* Quantity */}
              <div className="flex items-center justify-between border border-gris-medio rounded-xl p-1 bg-white sm:w-1/3">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-verde hover:bg-beige rounded-lg transition-colors"
                >
                  -
                </button>
                <span className="font-medium text-verde">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-verde hover:bg-beige rounded-r-lg font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || added}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-medium transition-all ${
                  added 
                    ? 'bg-green-500 text-white' 
                    : !product.inStock 
                      ? 'bg-gris-medio text-gris-texto cursor-not-allowed'
                      : 'bg-verde hover:bg-dorado text-white shadow-lg shadow-verde/20'
                }`}
              >
                {added ? (
                  <>
                    <Check size={20} /> Agregado
                  </>
                ) : (
                  <>
                    <ShoppingBag size={20} /> Agregar al carrito
                  </>
                )}
              </button>

              {/* Favorite */}
              <button
                onClick={() => toggleFavorite(product.id)}
                className={`w-14 h-14 flex items-center justify-center rounded-xl border transition-colors bg-white ${
                  favorite
                    ? 'border-dorado text-dorado'
                    : 'border-gris-medio text-gris-texto hover:text-red-500 hover:border-red-500'
                }`}
              >
                <Heart size={24} className={favorite ? 'fill-dorado' : ''} />
              </button>
            </div>
            
            {/* Trust Badges */}
            <div className="mt-8 flex flex-col gap-3 text-sm text-gris-texto bg-beige/30 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-xl">🚚</span> Envíos a todo el país
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">🛡️</span> Compra 100% segura
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">💳</span> Todos los medios de pago
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// Helper to determine if a hex color is light or dark
function isLightColor(hex: string): boolean {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

