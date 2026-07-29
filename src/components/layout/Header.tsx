'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Menu, X, Heart } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import { useProductStore } from '@/stores/useProductStore';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const cartItemCount = useCartStore((s) => s.getItemCount());
  const toggleCart = useCartStore((s) => s.toggleCart);
  const products = useProductStore((s) => s.products);

  const searchResults = searchQuery.length >= 2
    ? products.filter(
        (p) =>
          p.active &&
          (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSelect = (slug: string) => {
    setSearchOpen(false);
    setSearchQuery('');
    router.push(`/producto/${slug}`);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 safe-top ${
          scrolled
            ? 'glass shadow-md py-2'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Left: Menu + Search */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-full hover:bg-verde/5 transition-colors lg:hidden"
              aria-label="Menú"
            >
              <Menu size={22} className="text-verde" />
            </button>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-full hover:bg-verde/5 transition-colors"
              aria-label="Buscar"
            >
              <Search size={20} className="text-verde" />
            </button>
          </div>

          {/* Center: Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="Mate de a Dos"
              width={120}
              height={60}
              className="h-10 w-auto md:h-12"
              priority
            />
          </Link>

          {/* Right: Favorites + Cart */}
          <div className="flex items-center gap-2">
            <Link
              href="/favoritos"
              className="p-2 rounded-full hover:bg-verde/5 transition-colors hidden sm:flex"
              aria-label="Favoritos"
            >
              <Heart size={20} className="text-verde" />
            </Link>
            <button
              onClick={toggleCart}
              className="p-2 rounded-full hover:bg-verde/5 transition-colors relative"
              aria-label="Carrito"
            >
              <ShoppingBag size={20} className="text-verde" />
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-dorado text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center"
                >
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar Expandable */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-4 pb-3 pt-1">
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gris-texto"
                  />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-blanco rounded-xl border border-gris-medio focus:border-dorado focus:ring-1 focus:ring-dorado/30 outline-none transition-all text-sm font-body"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X size={18} className="text-gris-texto" />
                  </button>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 bg-blanco rounded-xl shadow-lg overflow-hidden"
                  >
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleSearchSelect(product.slug)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gris-claro transition-colors text-left"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gris-claro overflow-hidden flex-shrink-0">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-verde truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-dorado font-semibold">
                            {new Intl.NumberFormat('es-AR', {
                              style: 'currency',
                              currency: 'ARS',
                              minimumFractionDigits: 0,
                            }).format(product.price)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Desktop Navigation */}
      <nav className="hidden lg:block fixed top-0 left-0 right-0 z-40 pt-16">
        <div className={`transition-all duration-300 ${scrolled ? 'glass' : 'bg-transparent'}`}>
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-8 py-2">
            {['Inicio', 'Catálogo', 'Favoritos'].map((item) => (
              <Link
                key={item}
                href={item === 'Inicio' ? '/' : `/${item.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`}
                className="text-sm font-medium text-verde/70 hover:text-verde transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-dorado transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-verde/30 z-50"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-beige z-50 shadow-xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <Image
                    src="/images/logo.png"
                    alt="Mate de a Dos"
                    width={100}
                    height={50}
                    className="h-8 w-auto"
                  />
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="p-2 rounded-full hover:bg-verde/5"
                  >
                    <X size={20} className="text-verde" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {[
                    { label: 'Inicio', href: '/' },
                    { label: 'Catálogo', href: '/catalogo' },
                    { label: 'Favoritos', href: '/favoritos' },
                    { label: 'Carrito', href: '/carrito' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="block py-3 px-4 rounded-xl text-verde font-medium hover:bg-verde/5 transition-colors"
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
