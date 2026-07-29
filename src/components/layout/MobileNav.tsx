'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, Heart, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';

export default function MobileNav() {
  const pathname = usePathname();
  const cartItemCount = useCartStore((s) => s.getItemCount());
  const toggleCart = useCartStore((s) => s.toggleCart);

  const navItems = [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Catálogo', href: '/catalogo', icon: Grid },
    { name: 'Favoritos', href: '/favoritos', icon: Heart },
    { name: 'Carrito', href: '#', icon: ShoppingBag, badge: cartItemCount, isCart: true },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-blanco border-t border-gris-medio pb-safe z-40 px-6 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] safe-bottom">
      <div className="flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = item.isCart
            ? pathname === '/carrito'
            : pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          const Icon = item.icon;

          if (item.isCart) {
            return (
              <button
                key={item.name}
                onClick={toggleCart}
                className={`flex flex-col items-center justify-center p-2 relative transition-colors ${
                  isActive ? 'text-dorado' : 'text-gris-texto hover:text-verde'
                }`}
              >
                <div className="relative">
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-dorado text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-blanco box-content">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-medium mt-1 ${isActive ? 'text-dorado' : 'text-gris-texto'}`}>
                  {item.name}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center p-2 relative transition-colors ${
                isActive ? 'text-dorado' : 'text-gris-texto hover:text-verde'
              }`}
            >
              <div className="relative">
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-medium mt-1 ${isActive ? 'text-dorado' : 'text-gris-texto'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

