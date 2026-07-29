'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { scrapeProduct } from '@/actions/scrapeProduct';
import { useProductStore } from '@/stores/useProductStore';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { Search, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Product } from '@/types/types';

export default function ProductImporter() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [scrapedData, setScrapedData] = useState<{
    title: string;
    originalPrice: number;
    imageUrl: string;
    description: string;
  } | null>(null);

  const [markupPercent, setMarkupPercent] = useState(40);
  const [selectedCategory, setSelectedCategory] = useState('mates');

  const categories = useProductStore((s) => s.categories);
  const addProduct = useProductStore((s) => s.addProduct);

  const finalPrice = scrapedData 
    ? Math.round(scrapedData.originalPrice * (1 + markupPercent / 100))
    : 0;

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setScrapedData(null);

    const result = await scrapeProduct(url);

    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setScrapedData({
        ...result.data,
        imageUrl: result.data.imageUrl || '/images/placeholder.jpg',
      });
    }
    
    setLoading(false);
  };

  const handleImport = () => {
    if (!scrapedData) return;

    // Generate a simple slug and ID
    const baseSlug = scrapedData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const randomId = Math.random().toString(36).substring(2, 9);
    
    const newProduct: Product = {
      id: `imported-${randomId}`,
      name: scrapedData.title,
      slug: `${baseSlug}-${randomId}`,
      price: finalPrice,
      description: scrapedData.description || 'Producto importado',
      images: [scrapedData.imageUrl || '/images/placeholder.jpg'],
      category: selectedCategory,
      material: 'Varios',
      colors: [],
      inStock: true,
      active: true,
      featured: false,
      isNew: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    addProduct(newProduct);
    setSuccess(`¡Producto "${newProduct.name}" importado exitosamente!`);
    setScrapedData(null);
    setUrl('');
  };

  return (
    <div className="bg-blanco rounded-2xl shadow-sm border border-gris-medio p-6 md:p-8">
      <h2 className="text-2xl font-display font-medium text-verde mb-6">
        Importador Automático de Productos
      </h2>

      <form onSubmit={handleScrape} className="mb-8">
        <label className="block text-sm font-medium text-gris-texto mb-2">
          Link del producto (Digalo con Mate por Mayor)
        </label>
        <div className="flex gap-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://digaloconmatepormayor.com/producto/..."
            className="flex-grow bg-beige border border-gris-medio rounded-xl px-4 py-3 focus:outline-none focus:border-dorado focus:ring-1 focus:ring-dorado"
            required
          />
          <button
            type="submit"
            disabled={loading || !url}
            className="bg-verde hover:bg-dorado text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2 min-w-[140px] justify-center"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
            {loading ? 'Buscando...' : 'Obtener'}
          </button>
        </div>
        {error && (
          <p className="mt-3 text-red-500 text-sm flex items-center gap-1">
            <AlertCircle size={16} /> {error}
          </p>
        )}
        {success && (
          <p className="mt-3 text-green-600 text-sm flex items-center gap-1">
            <CheckCircle2 size={16} /> {success}
          </p>
        )}
      </form>

      {scrapedData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-gris-medio rounded-xl p-6 bg-beige/30"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 aspect-square relative rounded-lg overflow-hidden bg-white border border-gris-medio">
              {scrapedData.imageUrl ? (
                <Image
                  src={scrapedData.imageUrl}
                  alt={scrapedData.title}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gris-texto">
                  Sin imagen
                </div>
              )}
            </div>

            <div className="w-full md:w-2/3 flex flex-col">
              <h3 className="text-xl font-display font-medium text-verde mb-2">
                {scrapedData.title}
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6 bg-white p-4 rounded-lg border border-gris-medio">
                <div>
                  <p className="text-xs text-gris-texto uppercase tracking-wider mb-1">Precio Costo</p>
                  <p className="text-lg font-medium text-verde">{formatPrice(scrapedData.originalPrice)}</p>
                </div>
                <div>
                  <p className="text-xs text-gris-texto uppercase tracking-wider mb-1">Precio Venta Final</p>
                  <p className="text-xl font-bold text-dorado">{formatPrice(finalPrice)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gris-texto mb-2">
                    Margen de Ganancia (%)
                  </label>
                  <input
                    type="number"
                    value={markupPercent}
                    onChange={(e) => setMarkupPercent(Number(e.target.value))}
                    min="0"
                    className="w-full bg-white border border-gris-medio rounded-lg px-4 py-2 focus:outline-none focus:border-dorado"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gris-texto mb-2">
                    Categoría Destino
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-white border border-gris-medio rounded-lg px-4 py-2 focus:outline-none focus:border-dorado"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleImport}
                className="w-full bg-dorado hover:bg-verde text-white py-3 rounded-xl font-medium transition-colors shadow-md mt-auto"
              >
                Importar Producto al Catálogo
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
