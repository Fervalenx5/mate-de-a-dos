'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppURL } from '@/lib/utils';

export default function WhatsAppButton() {
  const WHATSAPP_NUMBER = '5491112345678'; // Placeholder until provided
  const message = 'Hola! Me gustaría hacer una consulta sobre los productos.';
  
  const href = getWhatsAppURL(WHATSAPP_NUMBER, message);

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 lg:bottom-6 right-4 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all animate-pulse-soft"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle size={28} />
    </motion.a>
  );
}
