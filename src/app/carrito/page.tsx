'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  User,
  Phone,
  FileText,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import { formatPrice, generateWhatsAppMessage, getWhatsAppURL } from '@/lib/utils';
import { CartItem as CartItemType } from '@/types/types';

const WHATSAPP_NUMBER = '5491150467924';

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();
  const totalPrice = getTotalPrice();

  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [observations, setObservations] = useState('');
  const [sent, setSent] = useState(false);

  const handleSendWhatsApp = () => {
    if (!name.trim() || !phone.trim()) return;

    const cartItems: CartItemType[] = items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      selectedColor: item.selectedColor,
    }));

    const message = generateWhatsAppMessage(cartItems, totalPrice, name, phone, observations);
    const url = getWhatsAppURL(WHATSAPP_NUMBER, message);
    window.open(url, '_blank');
    setSent(true);
  };

  if (sent) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md space-y-6"
        >
          <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
            <CheckCircle2 size={48} className="text-emerald-500" />
          </div>
          <h1 className="text-3xl font-display font-medium text-verde">
            ¡Pedido enviado!
          </h1>
          <p className="text-gris-texto">
            Tu pedido fue enviado por WhatsApp. Te vamos a contactar para coordinar el pago y envío.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <button
              onClick={() => {
                clearCart();
                setSent(false);
                setStep('cart');
                setName('');
                setPhone('');
                setObservations('');
              }}
              className="px-6 py-3 bg-verde text-white font-medium rounded-xl hover:bg-dorado transition-colors"
            >
              Nuevo Pedido
            </button>
            <Link
              href="/catalogo"
              className="px-6 py-3 border border-verde/20 text-verde font-medium rounded-xl hover:bg-verde/5 transition-colors text-center"
            >
              Seguir comprando
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md space-y-6">
          <div className="w-24 h-24 rounded-full bg-verde/5 flex items-center justify-center mx-auto text-verde/30">
            <ShoppingBag size={48} />
          </div>
          <h1 className="text-3xl font-display font-medium text-verde">Tu carrito está vacío</h1>
          <p className="text-gris-texto">
            ¡Explorá nuestros mates artesanales y armá tu pedido perfecto!
          </p>
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 px-8 py-4 bg-verde text-white font-medium rounded-xl hover:bg-dorado transition-colors shadow-lg shadow-verde/10"
          >
            Ver Catálogo <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blanco py-8 lg:py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 border-b border-gris-medio pb-6">
          <h1 className="text-3xl lg:text-4xl font-display font-medium text-verde mb-2">
            {step === 'cart' ? 'Tu Carrito' : 'Datos del Pedido'}
          </h1>
          <p className="text-gris-texto">
            {step === 'cart'
              ? `${items.reduce((acc, i) => acc + i.quantity, 0)} producto(s) en tu carrito`
              : 'Completá tus datos para enviar el pedido por WhatsApp'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={() => setStep('cart')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              step === 'cart'
                ? 'bg-verde text-white'
                : 'bg-verde/10 text-verde hover:bg-verde/20'
            }`}
          >
            <Package size={16} /> 1. Carrito
          </button>
          <div className="h-px w-8 bg-gris-medio" />
          <button
            onClick={() => step === 'checkout' && setStep('checkout')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              step === 'checkout'
                ? 'bg-verde text-white'
                : 'bg-gris-claro text-gris-texto'
            }`}
          >
            <MessageCircle size={16} /> 2. Enviar Pedido
          </button>
        </div>

        <AnimatePresence mode="wait">
          {step === 'cart' ? (
            <motion.div
              key="cart"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col lg:flex-row gap-8"
            >
              {/* Cart Items */}
              <div className="flex-1 space-y-4">
                {items.map((item, idx) => (
                  <motion.div
                    key={`${item.product.id}-${item.selectedColor?.hex || 'default'}`}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex gap-4 sm:gap-6 p-4 sm:p-5 bg-white rounded-2xl border border-verde/5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Image */}
                    <Link
                      href={`/producto/${item.product.slug}`}
                      className="w-24 h-24 sm:w-28 sm:h-28 bg-gris-claro rounded-xl relative overflow-hidden flex-shrink-0 group"
                    >
                      <Image
                        src={item.product.images[0] || '/images/placeholder.jpg'}
                        alt={item.product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <Link
                          href={`/producto/${item.product.slug}`}
                          className="font-display font-medium text-verde hover:text-dorado transition-colors text-base sm:text-lg leading-tight line-clamp-2"
                        >
                          {item.product.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gris-texto uppercase tracking-wider">
                            {item.product.category}
                          </p>
                          {item.selectedColor && (
                            <span className="flex items-center gap-1 text-xs text-gris-texto">
                              •
                              <span
                                className="w-3 h-3 rounded-full border border-gris-medio inline-block"
                                style={{ backgroundColor: item.selectedColor.hex }}
                              />
                              {item.selectedColor.name}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-verde/15 rounded-xl bg-beige/50">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                Math.max(1, item.quantity - 1),
                                item.selectedColor?.hex
                              )
                            }
                            className="p-2 text-verde hover:bg-verde/10 rounded-l-xl transition-colors"
                            aria-label="Restar unidad"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-4 text-sm font-semibold text-verde min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity + 1,
                                item.selectedColor?.hex
                              )
                            }
                            className="p-2 text-verde hover:bg-verde/10 rounded-r-xl transition-colors"
                            aria-label="Sumar unidad"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <p className="text-dorado font-bold text-lg">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                          <button
                            onClick={() => removeItem(item.product.id, item.selectedColor?.hex)}
                            className="p-2 text-gris-texto hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Eliminar producto"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Clear Cart */}
                <button
                  onClick={clearCart}
                  className="text-sm text-gris-texto hover:text-red-500 transition-colors mt-2"
                >
                  Vaciar carrito
                </button>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:w-80 flex-shrink-0">
                <div className="bg-beige/40 rounded-2xl p-6 border border-verde/5 sticky top-28 space-y-5">
                  <h3 className="font-display font-medium text-verde text-lg">Resumen</h3>

                  <div className="space-y-3 text-sm">
                    {items.map((item) => (
                      <div
                        key={`${item.product.id}-${item.selectedColor?.hex || 'default'}-summary`}
                        className="flex justify-between text-gris-texto"
                      >
                        <span className="truncate pr-2">
                          {item.product.name} x{item.quantity}
                        </span>
                        <span className="font-medium text-verde whitespace-nowrap">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-verde/10 pt-4 space-y-2">
                    <div className="flex justify-between text-sm text-gris-texto">
                      <span>Subtotal</span>
                      <span className="font-semibold text-verde">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gris-texto">
                      <span>Envío</span>
                      <span className="text-verde font-medium text-xs bg-verde/10 px-2 py-0.5 rounded-full">
                        A convenir
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-verde/10 pt-4 flex justify-between text-lg font-bold text-verde">
                    <span>Total</span>
                    <span className="text-dorado">{formatPrice(totalPrice)}</span>
                  </div>

                  <button
                    onClick={() => setStep('checkout')}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={20} />
                    Continuar al pedido
                  </button>

                  <Link
                    href="/catalogo"
                    className="w-full py-2 text-sm text-verde hover:text-dorado transition-colors text-center flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={16} />
                    Seguir comprando
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col lg:flex-row gap-8"
            >
              {/* Checkout Form */}
              <div className="flex-1">
                <div className="bg-white rounded-2xl border border-verde/5 shadow-sm p-6 sm:p-8 space-y-6">
                  <div>
                    <h2 className="font-display font-medium text-verde text-xl mb-1">
                      Tus Datos
                    </h2>
                    <p className="text-sm text-gris-texto">
                      Estos datos se incluyen en el mensaje de WhatsApp para que podamos contactarte.
                    </p>
                  </div>

                  {/* Name */}
                  <div className="space-y-2">
                    <label htmlFor="checkout-name" className="text-sm font-medium text-verde flex items-center gap-2">
                      <User size={16} className="text-dorado" /> Nombre completo *
                    </label>
                    <input
                      id="checkout-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej: Juan Pérez"
                      className="w-full px-4 py-3 bg-beige/30 border border-gris-medio rounded-xl focus:outline-none focus:border-dorado focus:ring-1 focus:ring-dorado/30 transition-all text-verde placeholder:text-gris-texto/50"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label htmlFor="checkout-phone" className="text-sm font-medium text-verde flex items-center gap-2">
                      <Phone size={16} className="text-dorado" /> Teléfono *
                    </label>
                    <input
                      id="checkout-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ej: 11 2345-6789"
                      className="w-full px-4 py-3 bg-beige/30 border border-gris-medio rounded-xl focus:outline-none focus:border-dorado focus:ring-1 focus:ring-dorado/30 transition-all text-verde placeholder:text-gris-texto/50"
                      required
                    />
                  </div>

                  {/* Observations */}
                  <div className="space-y-2">
                    <label htmlFor="checkout-observations" className="text-sm font-medium text-verde flex items-center gap-2">
                      <FileText size={16} className="text-dorado" /> Observaciones (opcional)
                    </label>
                    <textarea
                      id="checkout-observations"
                      value={observations}
                      onChange={(e) => setObservations(e.target.value)}
                      placeholder="Ej: Necesito que sea para regalo, con packaging especial..."
                      rows={3}
                      className="w-full px-4 py-3 bg-beige/30 border border-gris-medio rounded-xl focus:outline-none focus:border-dorado focus:ring-1 focus:ring-dorado/30 transition-all text-verde placeholder:text-gris-texto/50 resize-none"
                    />
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setStep('cart')}
                      className="px-6 py-3 border border-verde/20 text-verde font-medium rounded-xl hover:bg-verde/5 transition-colors flex items-center justify-center gap-2"
                    >
                      <ArrowLeft size={18} /> Volver al carrito
                    </button>
                    <button
                      onClick={handleSendWhatsApp}
                      disabled={!name.trim() || !phone.trim()}
                      className={`flex-1 py-4 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-white ${
                        name.trim() && phone.trim()
                          ? 'bg-[#25D366] hover:bg-[#1fad54] shadow-[#25D366]/20 hover:shadow-[#25D366]/30'
                          : 'bg-gris-medio text-gris-texto cursor-not-allowed shadow-none'
                      }`}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Enviar Pedido por WhatsApp
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Summary (compact on checkout) */}
              <div className="lg:w-80 flex-shrink-0">
                <div className="bg-beige/40 rounded-2xl p-6 border border-verde/5 sticky top-28 space-y-4">
                  <h3 className="font-display font-medium text-verde text-lg">Tu Pedido</h3>

                  <div className="space-y-3 max-h-60 overflow-y-auto no-scrollbar">
                    {items.map((item) => (
                      <div
                        key={`${item.product.id}-${item.selectedColor?.hex || 'default'}-checkout`}
                        className="flex gap-3 items-center"
                      >
                        <div className="w-12 h-12 rounded-lg bg-gris-claro relative overflow-hidden flex-shrink-0">
                          <Image
                            src={item.product.images[0] || '/images/placeholder.jpg'}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-verde truncate">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-gris-texto">
                            x{item.quantity}
                            {item.selectedColor && ` · ${item.selectedColor.name}`}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-dorado whitespace-nowrap">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-verde/10 pt-4 flex justify-between font-bold text-verde">
                    <span>Total</span>
                    <span className="text-dorado text-lg">{formatPrice(totalPrice)}</span>
                  </div>

                  <p className="text-xs text-gris-texto text-center">
                    El envío se coordina por WhatsApp
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
