'use client';

import { useProductStore } from '@/stores/useProductStore';
import ProductCard from '@/components/product/ProductCard';
import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

function CatalogContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('categoria');

  const allProducts = useProductStore((s) => s.products);
  const categories = useProductStore((s) => s.categories);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam || null);
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'newest'>('featured');

  const fetchProducts = useProductStore((s) => s.fetchProducts);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Update selected category if URL changes
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = allProducts.filter(p => p.active);

    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); // Very basic sort for now
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [allProducts, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-blanco py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header & Breadcrumbs */}
        <div className="mb-8 border-b border-gris-medio pb-6">
          <h1 className="text-3xl lg:text-4xl font-display font-medium text-verde mb-2">
            Catálogo de Productos
          </h1>
          <p className="text-gris-texto">
            {selectedCategory 
              ? `Explorando ${categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}`
              : 'Todos nuestros productos artesanales'}
            {' '}({filteredAndSortedProducts.length} resultados)
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Mobile Filter Toggle */}
          <div className="flex lg:hidden justify-between items-center bg-beige/30 p-4 rounded-xl border border-gris-medio">
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 font-medium text-verde"
            >
              <Filter size={20} /> Filtrar
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gris-texto">Ordenar:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border-none text-verde font-medium text-sm focus:ring-0 cursor-pointer"
              >
                <option value="featured">Destacados</option>
                <option value="newest">Novedades</option>
                <option value="price_asc">Menor precio</option>
                <option value="price_desc">Mayor precio</option>
              </select>
            </div>
          </div>

          {/* Sidebar Filters */}
          <AnimatePresence>
            {(isFilterOpen || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
              <motion.aside 
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                className={`
                  fixed inset-0 z-50 bg-blanco w-4/5 max-w-sm p-6 shadow-2xl lg:shadow-none 
                  lg:relative lg:z-0 lg:w-64 lg:max-w-none lg:p-0 lg:bg-transparent lg:block
                  ${isFilterOpen ? 'block' : 'hidden'}
                `}
              >
                <div className="flex justify-between items-center lg:hidden mb-8">
                  <h2 className="text-xl font-display font-medium text-verde">Filtros</h2>
                  <button onClick={() => setIsFilterOpen(false)} className="p-2 text-gris-texto hover:text-verde">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Categorías */}
                  <div>
                    <h3 className="font-medium text-verde mb-4 flex items-center gap-2">
                      <SlidersHorizontal size={18} /> Categorías
                    </h3>
                    <ul className="space-y-3">
                      <li>
                        <button 
                          onClick={() => { setSelectedCategory(null); setIsFilterOpen(false); }}
                          className={`text-sm w-full text-left transition-colors ${!selectedCategory ? 'text-dorado font-medium' : 'text-gris-texto hover:text-verde'}`}
                        >
                          Todos los productos
                        </button>
                      </li>
                      {categories.map(category => (
                        <li key={category.id}>
                          <button 
                            onClick={() => { setSelectedCategory(category.slug); setIsFilterOpen(false); }}
                            className={`text-sm w-full text-left flex items-center gap-2 transition-colors ${selectedCategory === category.slug ? 'text-dorado font-medium' : 'text-gris-texto hover:text-verde'}`}
                          >
                            <span>{category.icon}</span> {category.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Ordenar (Desktop) */}
                  <div className="hidden lg:block">
                    <h3 className="font-medium text-verde mb-4">Ordenar por</h3>
                    <div className="flex flex-col gap-3">
                      {[
                        { id: 'featured', label: 'Destacados' },
                        { id: 'newest', label: 'Novedades' },
                        { id: 'price_asc', label: 'Menor precio' },
                        { id: 'price_desc', label: 'Mayor precio' },
                      ].map((option) => (
                        <label key={option.id} className="flex items-center gap-3 cursor-pointer group">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${sortBy === option.id ? 'border-dorado' : 'border-gris-medio group-hover:border-verde'}`}>
                            {sortBy === option.id && <div className="w-2 h-2 rounded-full bg-dorado" />}
                          </div>
                          <input 
                            type="radio" 
                            name="sort" 
                            value={option.id}
                            checked={sortBy === option.id}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="hidden"
                          />
                          <span className={`text-sm ${sortBy === option.id ? 'text-verde font-medium' : 'text-gris-texto group-hover:text-verde'}`}>
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Overlay for mobile filter */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFilterOpen(false)}
                className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
              />
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-beige/30 rounded-2xl border border-gris-medio border-dashed">
                <span className="text-4xl mb-4">🏜️</span>
                <h3 className="text-xl font-medium text-verde mb-2">No se encontraron productos</h3>
                <p className="text-gris-texto max-w-md mb-6">
                  No hay productos que coincidan con la categoría seleccionada en este momento.
                </p>
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="bg-verde hover:bg-dorado text-white px-6 py-2 rounded-full transition-colors font-medium text-sm"
                >
                  Ver todos los productos
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-blanco py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-verde"></div>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
