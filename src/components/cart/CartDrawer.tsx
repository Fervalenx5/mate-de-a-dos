'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageCircle } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();

  const totalPrice = getTotalPrice();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-verde/40 backdrop-blur-sm z-50 transition-opacity"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-beige z-50 shadow-2xl flex flex-col justify-between"
          >
            <div className="p-6 border-b border-verde/10 flex items-center justify-between bg-blanco/60 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-verde/5 rounded-full text-verde">
                  <ShoppingBag size={22} />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-bold text-verde">Tu Carrito</h2>
                  <p className="text-xs text-gris-texto">
                    {items.length === 0 ? 'Sin productos' : `${items.reduce((acc, i) => acc + i.quantity, 0)} ítem(s)`}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gris-texto hover:text-verde rounded-full hover:bg-verde/5 transition-colors"
                aria-label="Cerrar carrito"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-verde/5 flex items-center justify-center text-verde/40">
                    <ShoppingBag size={40} />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-verde">Tu carrito está vacío</h3>
                    <p className="text-sm text-gris-texto mt-1">
                      ¡Explora nuestros mates artesanales y suma tus favoritos!
                    </p>
                  </div>
                  <Link
                    href="/catalogo"
                    onClick={() => setIsOpen(false)}
                    className="mt-4 px-6 py-3 bg-verde text-white font-medium rounded-xl hover:bg-dorado transition-colors shadow-md shadow-verde/10 flex items-center gap-2"
                  >
                    Ver Catálogo <ArrowRight size={18} />
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={`${item.product.id}-${item.selectedColor?.hex || 'default'}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex gap-4 p-3 bg-blanco rounded-2xl border border-verde/5 shadow-sm items-center"
                  >
                    <div className="w-20 h-20 bg-gris-claro rounded-xl relative overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.images[0] || '/images/placeholder.jpg'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-verde truncate">
                        {item.product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-dorado font-bold">
                          {formatPrice(item.product.price)}
                        </p>
                        {item.selectedColor && (
                          <span className="flex items-center gap-1 text-[10px] text-gris-texto">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-gris-medio inline-block"
                              style={{ backgroundColor: item.selectedColor.hex }}
                            />
                            {item.selectedColor.name}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-verde/15 rounded-lg bg-beige/50">
                          <button
                            onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1), item.selectedColor?.hex)}
                            className="p-1 text-verde hover:bg-verde/10 rounded-l-lg transition-colors"
                            aria-label="Restar unidad"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 text-xs font-semibold text-verde">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedColor?.hex)}
                            className="p-1 text-verde hover:bg-verde/10 rounded-r-lg transition-colors"
                            aria-label="Sumar unidad"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.product.id, item.selectedColor?.hex)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Eliminar producto"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 bg-blanco border-t border-verde/10 space-y-4 shadow-lg">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gris-texto">
                    <span>Subtotal</span>
                    <span className="font-semibold text-verde">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gris-texto">
                    <span>Envío</span>
                    <span className="text-verde font-medium text-xs bg-verde/10 px-2 py-0.5 rounded-full">A convenir</span>
                  </div>
                  <div className="border-t border-verde/10 pt-2 flex justify-between text-base font-bold text-verde">
                    <span>Total Estimado</span>
                    <span className="text-dorado text-lg">{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Link
                    href="/carrito"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <MessageCircle size={18} />
                    Finalizar Pedido
                  </Link>

                  <button
                    onClick={clearCart}
                    className="w-full py-2 text-xs text-gris-texto hover:text-red-500 transition-colors text-center block"
                  >
                    Vaciar carrito
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
