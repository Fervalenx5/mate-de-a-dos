'use client';

import { useState } from 'react';
import { useProductStore } from '@/stores/useProductStore';
import { formatPrice } from '@/lib/utils';
import { Edit2, Trash2, Check, X, Tag, Plus, Eye, EyeOff, Star } from 'lucide-react';
import Image from 'next/image';
import { Product } from '@/types/types';

export default function ProductCatalogEditor() {
  const products = useProductStore((s) => s.products);
  const categories = useProductStore((s) => s.categories);
  const updateProduct = useProductStore((s) => s.updateProduct);
  const deleteProduct = useProductStore((s) => s.deleteProduct);
  const toggleProductActive = useProductStore((s) => s.toggleProductActive);
  const toggleProductFeatured = useProductStore((s) => s.toggleProductFeatured);
  const addProduct = useProductStore((s) => s.addProduct);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editName, setEditName] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modal para agregar producto manual
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState<number | ''>('');
  const [newCategory, setNewCategory] = useState('mates');
  const [newDescription, setNewDescription] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('/images/products/termo-negro.png');

  const startEditing = (product: Product) => {
    setEditingId(product.id);
    setEditPrice(product.price);
    setEditName(product.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEditing = (id: string) => {
    if (editPrice > 0 && editName.trim() !== '') {
      updateProduct(id, {
        price: editPrice,
        name: editName,
      });
    }
    setEditingId(null);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPrice) return;

    const baseSlug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const randomId = Math.random().toString(36).substring(2, 7);

    const newProd: Product = {
      id: `manual-${randomId}`,
      name: newName,
      slug: `${baseSlug}-${randomId}`,
      price: Number(newPrice),
      description: newDescription || 'Nuevo producto disponible en Mate de a Dos.',
      category: newCategory,
      material: 'Calabaza / Cuero / Alpaca',
      colors: [],
      images: [newImageUrl || '/images/products/termo-negro.png'],
      featured: false,
      isNew: true,
      active: true,
      inStock: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    addProduct(newProd);
    setShowAddModal(false);
    setNewName('');
    setNewPrice('');
    setNewDescription('');
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-blanco rounded-2xl shadow-sm border border-gris-medio p-6 md:p-8 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-display font-medium text-verde">
            Gestor de Catálogo y Precios
          </h2>
          <p className="text-gris-texto text-sm">
            Modificá precios, cambiá nombres, destacá productos o agregá nuevos.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-verde hover:bg-dorado text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Nuevo Producto
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-beige border border-gris-medio rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-dorado"
          />
        </div>
        <div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-beige border border-gris-medio rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-dorado"
          >
            <option value="all">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gris-medio text-gris-texto font-medium">
              <th className="py-3 px-2">Producto</th>
              <th className="py-3 px-2">Categoría</th>
              <th className="py-3 px-2">Precio</th>
              <th className="py-3 px-2 text-center">Estado</th>
              <th className="py-3 px-2 text-center">Destacado</th>
              <th className="py-3 px-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gris-medio/50">
            {filteredProducts.map((product) => {
              const isEditing = editingId === product.id;
              return (
                <tr key={product.id} className="hover:bg-beige/20 transition-colors">
                  {/* Foto y Nombre */}
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg bg-beige overflow-hidden flex-shrink-0 border border-gris-medio">
                        <Image
                          src={product.images[0] || '/images/products/termo-negro.png'}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="bg-beige border border-dorado rounded-lg px-2 py-1 text-sm text-verde font-medium w-full"
                        />
                      ) : (
                        <span className="font-medium text-verde line-clamp-1">{product.name}</span>
                      )}
                    </div>
                  </td>

                  {/* Categoría */}
                  <td className="py-3 px-2 capitalize text-gris-texto">
                    {product.category}
                  </td>

                  {/* Precio */}
                  <td className="py-3 px-2 font-medium">
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <span className="text-verde font-bold">$</span>
                        <input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(Number(e.target.value))}
                          className="bg-beige border border-dorado rounded-lg px-2 py-1 text-sm font-bold text-verde w-24"
                        />
                      </div>
                    ) : (
                      <span className="text-verde font-bold">{formatPrice(product.price)}</span>
                    )}
                  </td>

                  {/* Estado Visible / Oculto */}
                  <td className="py-3 px-2 text-center">
                    <button
                      onClick={() => toggleProductActive(product.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        product.active
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-600 hover:bg-red-200'
                      }`}
                      title={product.active ? 'Visible en tienda' : 'Oculto'}
                    >
                      {product.active ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </td>

                  {/* Destacado */}
                  <td className="py-3 px-2 text-center">
                    <button
                      onClick={() => toggleProductFeatured(product.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        product.featured
                          ? 'bg-amber-100 text-amber-600'
                          : 'text-gris-texto/40 hover:text-amber-500'
                      }`}
                      title={product.featured ? 'Destacado en Home' : 'Hacer destacado'}
                    >
                      <Star size={16} fill={product.featured ? 'currentColor' : 'none'} />
                    </button>
                  </td>

                  {/* Acciones */}
                  <td className="py-3 px-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => saveEditing(product.id)}
                            className="p-1.5 bg-verde text-white rounded-lg hover:bg-dorado transition-colors"
                            title="Guardar"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="p-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            title="Cancelar"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(product)}
                            className="p-1.5 text-verde hover:bg-beige rounded-lg transition-colors"
                            title="Editar precio/nombre"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`¿Seguro que deseas eliminar "${product.name}"?`)) {
                                deleteProduct(product.id);
                              }
                            }}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar producto"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal para Agregar Producto */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-blanco rounded-2xl p-6 md:p-8 max-w-md w-full border border-gris-medio shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-display font-medium text-verde">Agregar Producto Nuevo</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gris-texto hover:text-verde">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gris-texto mb-1">Nombre del Producto</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej: Mate Imperial Cuero Marrón"
                  className="w-full bg-beige border border-gris-medio rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-dorado"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gris-texto mb-1">Precio ($)</label>
                <input
                  type="number"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Ej: 45000"
                  className="w-full bg-beige border border-gris-medio rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-dorado"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gris-texto mb-1">Categoría</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-beige border border-gris-medio rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-dorado"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gris-texto mb-1">Descripción</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                  placeholder="Detalles y especificaciones..."
                  className="w-full bg-beige border border-gris-medio rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-dorado"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gris-texto mb-1">Imagen del producto</label>
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          if (reader.result) {
                            setNewImageUrl(reader.result as string);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full text-xs text-gris-texto file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-verde file:text-white hover:file:bg-dorado file:cursor-pointer"
                  />
                  <input
                    type="text"
                    value={newImageUrl.startsWith('data:') ? 'Imagen cargada localmente ✔️' : newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="o escribí una URL/ruta de la imagen..."
                    className="w-full bg-beige border border-gris-medio rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-dorado text-gris-texto"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 border border-gris-medio rounded-xl py-2 text-sm font-medium text-gris-texto hover:bg-beige"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-verde hover:bg-dorado text-white rounded-xl py-2 text-sm font-medium transition-colors"
                >
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
