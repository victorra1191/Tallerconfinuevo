import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Save, X, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '../../hooks/use-toast';

const ProductsCRUD = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  
  // Estado para el formulario (Crear o Editar)
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    sku: '',
    price: '',
    type: '',
    description: '',
    image: '',
    in_stock: true
  });

  // 1. LEER PRODUCTOS DE NEON
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // RUTA RELATIVA: Conecta directo a Vercel/Neon sin CORS
      const response = await axios.get('/api/products');
      
      if (response.data && Array.isArray(response.data)) {
        setProducts(response.data);
      } else if (response.data && Array.isArray(response.data.products)) {
        setProducts(response.data.products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error cargando productos:", error);
      toast({
        variant: "destructive",
        title: "Error de conexión",
        description: "No se pudieron cargar los productos de la base de datos.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  // Preparar formulario para editar
  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name || '',
      brand: product.brand || '',
      sku: product.sku || '',
      price: product.price || '',
      type: product.type || '',
      description: product.description || '',
      image: product.image || '',
      in_stock: product.in_stock !== false // asume true si es null
    });
  };

  // Cancelar edición
  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      name: '', brand: '', sku: '', price: '', type: '', description: '', image: '', in_stock: true
    });
  };

  // 2. CREAR O ACTUALIZAR EN NEON
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Asegurarnos de que el precio sea un número
      const payload = {
        ...formData,
        price: parseFloat(formData.price)
      };

      if (editingId) {
        // ACTUALIZAR (PUT)
        await axios.put(`/api/products/${editingId}`, payload);
        toast({
          title: "Producto actualizado",
          description: "Los cambios se guardaron en la base de datos.",
          className: "bg-green-500 text-white"
        });
      } else {
        // CREAR (POST)
        await axios.post('/api/products', payload);
        toast({
          title: "Producto creado",
          description: "El nuevo producto se añadió al inventario.",
          className: "bg-green-500 text-white"
        });
      }
      
      // Limpiar formulario y recargar lista
      handleCancel();
      fetchProducts();
      
    } catch (error) {
      console.error("Error guardando:", error);
      toast({
        variant: "destructive",
        title: "Error al guardar",
        description: "Revisa los datos e intenta de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  // 3. ELIMINAR DE NEON
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto permanentemente?')) {
      try {
        setLoading(true);
        await axios.delete(`/api/products/${id}`);
        
        toast({
          title: "Producto eliminado",
          description: "El producto fue borrado de la base de datos."
        });
        
        // Recargar lista
        fetchProducts();
      } catch (error) {
        console.error("Error eliminando:", error);
        toast({
          variant: "destructive",
          title: "Error al eliminar",
          description: "No se pudo borrar el producto.",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* FORMULARIO DE CREACIÓN/EDICIÓN */}
      <Card className="border-0 shadow-md">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-xl text-[#004A9F]">
            {editingId ? 'Editar Producto' : 'Añadir Nuevo Producto'}
          </CardTitle>
          <CardDescription>
            {editingId ? 'Modifica los datos y presiona guardar.' : 'Ingresa los datos del nuevo producto para la base de datos Neon.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2 lg:col-span-2">
                <label className="text-sm font-medium">Nombre del Producto *</label>
                <Input name="name" value={formData.name} onChange={handleChange} required placeholder="Ej: Aceite 5W30" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">SKU *</label>
                <Input name="sku" value={formData.sku} onChange={handleChange} required placeholder="Ej: ACT-001" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Precio ($) *</label>
                <Input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required placeholder="0.00" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Marca</label>
                <Input name="brand" value={formData.brand} onChange={handleChange} placeholder="Ej: Motul" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoría (Tipo)</label>
                <Input name="type" value={formData.type} onChange={handleChange} placeholder="Ej: ACEITES" />
              </div>
              <div className="space-y-2 lg:col-span-2">
                <label className="text-sm font-medium">URL de Imagen (Cloudinary)</label>
                <Input name="image" value={formData.image} onChange={handleChange} placeholder="https://res.cloudinary.com/..." />
              </div>
              
              <div className="space-y-2 lg:col-span-4">
                <label className="text-sm font-medium">Descripción</label>
                <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="Detalles del producto..." rows={2} />
              </div>

              <div className="flex items-center space-x-2 lg:col-span-4 mt-2">
                <input 
                  type="checkbox" 
                  id="in_stock" 
                  name="in_stock" 
                  checked={formData.in_stock} 
                  onChange={handleChange}
                  className="w-4 h-4 text-[#D71920] rounded border-gray-300 focus:ring-[#D71920]"
                />
                <label htmlFor="in_stock" className="text-sm font-medium cursor-pointer">
                  Producto disponible en inventario (En Stock)
                </label>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t mt-6">
              <Button type="submit" className="bg-[#004A9F] text-white hover:bg-blue-800" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                {editingId ? 'Guardar Cambios' : 'Crear Producto'}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" /> Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* LISTA DE PRODUCTOS (TABLA) */}
      <Card className="border-0 shadow-md">
        <CardHeader className="bg-gray-50 border-b flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">Inventario Actual</CardTitle>
            <CardDescription>Gestiona los productos existentes en Neon ({products.length} productos).</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchProducts} disabled={loading}>
            <Loader2 className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Precio</th>
                  <th className="px-4 py-3">Marca</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 && !loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-400">No hay productos en la base de datos.</td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono font-medium text-gray-900">{product.sku}</td>
                      <td className="px-4 py-3 font-medium text-gray-900 truncate max-w-[200px]" title={product.name}>{product.name}</td>
                      <td className="px-4 py-3 text-[#D71920] font-bold">${Number(product.price).toFixed(2)}</td>
                      <td className="px-4 py-3">{product.brand}</td>
                      <td className="px-4 py-3">
                        {product.in_stock ? 
                          <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold">Sí</span> : 
                          <span className="text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-bold">No</span>
                        }
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" className="h-8 w-8 text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => handleEdit(product)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleDelete(product.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsCRUD;
