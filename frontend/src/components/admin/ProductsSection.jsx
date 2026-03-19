import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, Eye, Edit, DollarSign, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useToast } from '../../hooks/use-toast';

const ProductsSection = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, quotesRes] = await Promise.all([
        fetch('/api/products/'),  // Added trailing slash
        fetch('/api/admin/quotes', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
        })
      ]);

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        console.log('Products loaded:', productsData);
        setProducts(productsData || []);  // Direct array, not nested
      } else {
        console.error('Products response not OK:', productsRes.status);
      }

      if (quotesRes.ok) {
        const quotesData = await quotesRes.json();
        console.log('Quotes loaded:', quotesData);
        setQuotes(quotesData.quotes || []);
      } else {
        console.error('Quotes response not OK:', quotesRes.status);
      }

    } catch (error) {
      console.error('Load data error:', error);
      toast({
        title: "Error",
        description: "Error cargando datos de productos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const brands = ['all', ...new Set(products.map(p => p.brand))];
  const types = ['all', ...new Set(products.map(p => p.type))];

  const getProductStats = (productSku) => {
    const productQuotes = quotes.filter(quote => 
      quote.products && quote.products.some(p => p.sku === productSku)
    );
    
    const totalQuantity = productQuotes.reduce((sum, quote) => {
      const product = quote.products.find(p => p.sku === productSku);
      return sum + (product?.quantity || 0);
    }, 0);

    return {
      total_quotes: productQuotes.length,
      total_quantity: totalQuantity,
      recent_quotes: productQuotes.filter(quote => {
        const quoteDate = new Date(quote.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return quoteDate > weekAgo;
      }).length
    };
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrand === 'all' || product.brand === selectedBrand;
    const matchesType = selectedType === 'all' || product.type === selectedType;
    
    return matchesSearch && matchesBrand && matchesType;
  });

  const topProducts = products
    .map(product => ({
      ...product,
      stats: getProductStats(product.sku)
    }))
    .sort((a, b) => b.stats.total_quotes - a.stats.total_quotes)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#D71920]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Productos</h2>
          <p className="text-gray-600">Administra el catálogo de productos</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Productos</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cotizaciones</p>
                <p className="text-2xl font-bold text-gray-900">{quotes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Marcas</p>
                <p className="text-2xl font-bold text-gray-900">{brands.length - 1}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categorías</p>
                <p className="text-2xl font-bold text-gray-900">{types.length - 1}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D71920] focus:border-transparent"
            >
              {brands.map(brand => (
                <option key={brand} value={brand}>
                  {brand === 'all' ? 'Todas las marcas' : brand}
                </option>
              ))}
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D71920] focus:border-transparent"
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'Todos los tipos' : type}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Top Products */}
      {topProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Productos Más Cotizados</span>
            </CardTitle>
            <CardDescription>
              Los productos con más solicitudes de cotización
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.sku} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#D71920] to-[#004A9F] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.brand} - {product.type}</p>
                      <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#D71920]">{product.stats.total_quotes}</p>
                    <p className="text-sm text-gray-500">cotizaciones</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => {
          const stats = getProductStats(product.sku);
          return (
            <Card key={product.sku} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">{product.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">SKU:</span>
                        <span className="text-sm font-medium">{product.sku}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Marca:</span>
                        <Badge variant="outline">{product.brand}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Tipo:</span>
                        <Badge variant="outline">{product.type}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Precio:</span>
                        <span className="text-lg font-bold text-[#D71920]">${product.price}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <p className="text-lg font-bold text-blue-600">{stats.total_quotes}</p>
                        <p className="text-xs text-blue-800">Cotizaciones</p>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <p className="text-lg font-bold text-green-600">{stats.total_quantity}</p>
                        <p className="text-xs text-green-800">Cantidad total</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-1">
                    {stats.recent_quotes > 0 && (
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        {stats.recent_quotes} esta semana
                      </Badge>
                    )}
                  </div>
                  <Button
                    onClick={() => {
                      toast({
                        title: "Información del Producto",
                        description: `${product.name}\nCotizaciones: ${stats.total_quotes}\nPrecio: $${product.price}`,
                      });
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
            <p className="text-gray-500">
              {products.length === 0 
                ? 'Aún no hay productos registrados en el sistema'
                : 'Intenta ajustar tus filtros de búsqueda'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductsSection;