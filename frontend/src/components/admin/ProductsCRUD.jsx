import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useToast } from '../../hooks/use-toast';

const ProductsCRUD = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    sku: '',
    type: '',
    brand: '',
    uses: '',
    description: '',
    keywords: []
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error cargando productos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('admin_token');
      const url = editingProduct 
        ? `/api/admin/products/${editingProduct.id}`
        : '/api/admin/products';
      
      const method = editingProduct ? 'PUT' : 'POST';
      const body = editingProduct ? formData : {
        ...formData,
        id: Date.now().toString(),
        price: parseFloat(formData.price),
        keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k)
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        toast({
          title: "Éxito",
          description: editingProduct ? "Producto actualizado" : "Producto creado",
        });
        
        resetForm();
        loadProducts();
      } else {
        throw new Error('Error en la operación');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error guardando producto",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      keywords: product.keywords ? product.keywords.join(', ') : ''
    });
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Producto eliminado",
        });
        loadProducts();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error eliminando producto",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      sku: '',
      type: '',
      brand: '',
      uses: '',
      description: '',
      keywords: []
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  if (loading && products.length === 0) {
    return <div className="text-center py-8">Cargando productos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Productos</h2>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-[#D71920] hover:bg-[#b01319]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <Card className="border-2 border-[#D71920]">
          <CardHeader>
            <CardTitle>
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </CardTitle>
            <CardDescription>
              Completa los datos del producto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nombre</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">SKU</label>
                  <Input
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Precio</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Marca</label>
                  <Input
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tipo</label>
                  <Input
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Usos</label>
                  <Input
                    value={formData.uses}
                    onChange={(e) => setFormData({...formData, uses: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Descripción</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Palabras clave (separadas por comas)
                </label>
                <Input
                  value={formData.keywords}
                  onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                  placeholder="aceite, motor, lubricante"
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {editingProduct ? 'Actualizar' : 'Crear'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Products List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription>{product.sku}</CardDescription>
                </div>
                <Badge variant="secondary">${product.price}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Marca:</strong> {product.brand}</p>
                <p><strong>Tipo:</strong> {product.type}</p>
                <p><strong>Usos:</strong> {product.uses}</p>
                <p className="text-gray-600">{product.description}</p>
              </div>
              
              <div className="flex space-x-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(product)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(product.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductsCRUD;