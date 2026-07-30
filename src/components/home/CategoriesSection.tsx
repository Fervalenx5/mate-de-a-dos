'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useProductStore } from '@/stores/useProductStore';
import { Coffee, Crown, Rocket, Sparkles, Star, Flame } from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  mates: <Coffee className="w-8 h-8 text-verde group-hover:text-white transition-colors" />,
  imperiales: <Crown className="w-8 h-8 text-verde group-hover:text-white transition-colors" />,
  torpedos: <Rocket className="w-8 h-8 text-verde group-hover:text-white transition-colors" />,
  camioneros: <Sparkles className="w-8 h-8 text-verde group-hover:text-white transition-colors" />,
  variados: <Star className="w-8 h-8 text-verde group-hover:text-white transition-colors" />,
  termos: <Flame className="w-8 h-8 text-verde group-hover:text-white transition-colors" />,
};

export default function CategoriesSection() {
  const categories = useProductStore((s) => s.categories);
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
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6"
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <Link
                href={`/catalogo?categoria=${category.slug}`}
                className="group flex flex-col items-center justify-center p-6 bg-beige rounded-2xl hover:bg-dorado hover:shadow-xl transition-all duration-300 h-full border border-gris-medio/30"
              >
                <div className="p-4 bg-white/60 rounded-full mb-3 group-hover:bg-white/20 transition-colors">
                  {categoryIcons[category.slug] || <Coffee className="w-8 h-8 text-verde group-hover:text-white transition-colors" />}
                </div>
                <span className="font-medium text-verde group-hover:text-white transition-colors text-center text-sm">
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
