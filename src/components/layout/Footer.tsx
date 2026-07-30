'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blanco pt-16 pb-24 lg:pb-12 border-t border-gris-medio">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/images/logo.png"
                alt="Mate de a Dos"
                width={120}
                height={60}
                className="h-12 w-auto grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            </Link>
            <p className="text-gris-texto text-sm mb-6 max-w-xs">
              El mate perfecto para compartir. Artesanía, calidad y tradición en cada detalle.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://www.instagram.com/matedeados_18/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-gris-claro rounded-full text-verde hover:bg-dorado hover:text-white transition-colors" 
                title="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="mailto:matedeados@gmail.com" className="p-2 bg-gris-claro rounded-full text-verde hover:bg-dorado hover:text-white transition-colors" title="Email">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Links: Tienda */}
          <div>
            <h4 className="font-display font-semibold text-verde text-lg mb-6">Tienda</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/catalogo?categoria=mates" className="text-gris-texto hover:text-dorado transition-colors text-sm">
                  Mates
                </Link>
              </li>
              <li>
                <Link href="/catalogo?categoria=imperiales" className="text-gris-texto hover:text-dorado transition-colors text-sm">
                  Imperiales
                </Link>
              </li>
              <li>
                <Link href="/catalogo?categoria=torpedos" className="text-gris-texto hover:text-dorado transition-colors text-sm">
                  Torpedos
                </Link>
              </li>
              <li>
                <Link href="/catalogo?categoria=camioneros" className="text-gris-texto hover:text-dorado transition-colors text-sm">
                  Camioneros
                </Link>
              </li>
              <li>
                <Link href="/catalogo?categoria=termos" className="text-gris-texto hover:text-dorado transition-colors text-sm">
                  Termos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-display font-semibold text-verde text-lg mb-6">Contacto</h4>
            <ul className="space-y-4">
              <li className="text-sm text-gris-texto">
                <span className="block font-medium text-verde mb-1">WhatsApp:</span>
                <a href="https://wa.me/5491150467924" target="_blank" rel="noopener noreferrer" className="hover:text-dorado transition-colors">
                  +54 9 11 5046-7924
                </a>
              </li>
              <li className="text-sm text-gris-texto">
                <span className="block font-medium text-verde mb-1">Email:</span>
                <a href="mailto:matedeados@gmail.com" className="hover:text-dorado transition-colors">
                  matedeados@gmail.com
                </a>
              </li>
              <li className="text-sm text-gris-texto">
                <span className="block font-medium text-verde mb-1">Atención personalizada:</span>
                Envíos a todo el país
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gris-medio flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gris-texto">
            &copy; {currentYear} Mate de a Dos. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
