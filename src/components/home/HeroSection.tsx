'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative h-[85vh] lg:h-[80vh] w-full flex items-center justify-center overflow-hidden">
      {/* Background Image: Desktop (Horizontal) vs Mobile (Vertical) */}
      <div className="absolute inset-0 z-0">
        {/* Desktop Hero Image */}
        <Image
          src="/images/hero.png"
          alt="Mate al atardecer"
          fill
          priority
          className="hidden md:block object-cover object-center"
          sizes="100vw"
        />
        {/* Mobile Hero Image (Vertical 9:16) */}
        <Image
          src="/images/hero-mobile.png"
          alt="Mate al atardecer Celular"
          fill
          priority
          className="block md:hidden object-cover object-center"
          sizes="100vw"
        />
        {/* Soft Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-verde/85 via-verde/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-3xl md:text-5xl lg:text-6xl font-display font-medium text-white mb-8 drop-shadow-md"
        >
          El mate perfecto para compartir.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link
            href="/catalogo"
            className="inline-flex items-center justify-center bg-dorado hover:bg-white text-white hover:text-verde font-medium px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 text-lg"
          >
            Ver catálogo
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
