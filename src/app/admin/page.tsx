'use client';

import { useProductStore } from '@/stores/useProductStore';
import ProductImporter from '@/components/admin/ProductImporter';
import ProductCatalogEditor from '@/components/admin/ProductCatalogEditor';
import { useState } from 'react';
import { Lock } from 'lucide-react';
import Image from 'next/image';

export default function AdminPage() {
  const isAdminAuthenticated = useProductStore((s) => s.isAdminAuthenticated);
  const authenticateAdmin = useProductStore((s) => s.authenticateAdmin);
  const logoutAdmin = useProductStore((s) => s.logoutAdmin);
  const totalProducts = useProductStore((s) => s.products.length);
  const totalCategories = useProductStore((s) => s.categories.length);
  
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authenticateAdmin(password)) {
      setError('Contraseña incorrecta');
    }
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-beige/30 px-4">
        <div className="bg-blanco p-8 rounded-2xl shadow-md border border-gris-medio max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-dorado/10 p-4 rounded-full text-dorado">
              <Lock size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-display font-medium text-verde mb-2">Panel de Administración</h1>
          <p className="text-gris-texto mb-8">Ingresá tu contraseña para continuar</p>
          
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full bg-beige border border-gris-medio rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-dorado focus:ring-1 focus:ring-dorado text-center"
              placeholder="Contraseña"
              required
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-verde hover:bg-dorado text-white py-3 rounded-xl font-medium transition-colors"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige/30 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-medium text-verde">Panel de Control</h1>
            <p className="text-gris-texto">Administrá tus productos e importaciones.</p>
          </div>
          <button
            onClick={() => logoutAdmin()}
            className="text-sm text-gris-texto hover:text-red-500 transition-colors px-4 py-2 border border-gris-medio rounded-lg hover:border-red-500 bg-white"
          >
            Cerrar Sesión
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <ProductImporter />
            
            {/* Gestor Interactivo de Catálogo y Precios */}
            <ProductCatalogEditor />
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            <div className="bg-blanco rounded-2xl shadow-sm border border-gris-medio p-6">
              <h3 className="font-display font-medium text-verde text-lg mb-4">Estadísticas</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gris-medio">
                  <span className="text-gris-texto">Total Productos</span>
                  <span className="font-medium text-verde text-lg">
                    {totalProducts}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gris-medio">
                  <span className="text-gris-texto">Categorías</span>
                  <span className="font-medium text-verde text-lg">
                    {totalCategories}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
