'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { categories } from '@/data/products';

export default function CategoriesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-20 bg-blanco">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-medium text-verde mb-4">Nuestras Categorías</h2>
          <p className="text-gris-texto max-w-2xl mx-auto">
            Explorá nuestra selección de productos premium, diseñados para llevar tu experiencia matera al siguiente nivel.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6"
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <Link
                href={`/catalogo?categoria=${category.slug}`}
                className="group flex flex-col items-center justify-center p-8 bg-beige rounded-2xl hover:bg-dorado hover:shadow-xl transition-all duration-300 h-full"
              >
                <span className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 block">
                  {category.icon}
                </span>
                <span className="font-medium text-verde group-hover:text-white transition-colors text-center">
                  {category.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
