import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Search, ShoppingCart, Calculator, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import QuoteModal from '../components/QuoteModal';

const getProductImageByType = (product) => {
  const brand = product.brand?.toLowerCase().replace(/\s+/g, '-') || 'generico';
  return `/images/marcas/${brand}.png`;
};

const Products = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteCount, setQuoteCount] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Certeza técnica: CRACO requiere process.env y el prefijo REACT_APP_
        const baseUrl = process.env.REACT_APP_API_URL || '/api';
        
        // Limpiamos la URL para evitar dobles barras //
        const cleanUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        
        // Llamada exacta al endpoint de Python configurado en el backend
        const response = await axios.get(`${cleanUrl}/products`);
        
        setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error detallado de conexión:", error);
        toast({
          variant: "destructive",
          title: "Error de inventario",
          description: "No se pudo conectar con la base de datos Neon.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [toast]);

  useEffect(() => {
    const updateQuoteCount = () => {
      const saved = JSON.parse(localStorage.getItem('quoteList') || '[]');
      setQuoteCount(saved.reduce((total, item) => total + (item.quantity || 1), 0));
    };
    updateQuoteCount();
    window.addEventListener('storage', updateQuoteCount);
    return () => window.removeEventListener('storage', updateQuoteCount);
  }, []);

  const categories = useMemo(() => {
    if (!products.length) return [];
    return [...new Set(products.map(p => p.type))].filter(Boolean).sort();
  }, [products]);

  const brands = useMemo(() => {
    if (!products.length) return [];
    return [...new Set(products.map(p => p.brand))].filter(Boolean).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' || 
        product.name?.toLowerCase().includes(searchLower) ||
        product.brand?.toLowerCase().includes(searchLower) ||
        product.sku?.toLowerCase().includes(searchLower);
      
      const matchesCategory = selectedCategory === 'all' || product.type === selectedCategory;
      const matchesBrand = selectedBrand === 'all' || product.brand === selectedBrand;
      
      return matchesSearch && matchesCategory && matchesBrand;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return (a.name || '').localeCompare(b.name || '');
    });
  }, [searchTerm, selectedCategory, selectedBrand, sortBy, products]);

  const handleAddToCart = (product) => {
    const saved = JSON.parse(localStorage.getItem('quoteList') || '[]');
    const existing = saved.find(item => item.id === product.id);
    let newList = existing 
      ? saved.map(item => item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item)
      : [...saved, { ...product, quantity: 1 }];

    localStorage.setItem('quoteList', JSON.stringify(newList));
    window.dispatchEvent(new Event('storage'));
    toast({ title: "Agregado", description: `${product.name} a la lista.` });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-helvetica">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#004A9F] to-[#D71920] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Catálogo de Productos</h1>
          <p className="text-lg opacity-90">Inventario real sincronizado con Neon</p>
        </div>
      </div>

      {/* Toolbar / Filters */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nombre, marca o SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-40 bg-white">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="w-full md:w-32 bg-white">
                <SelectValue placeholder="Marca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Marcas</SelectItem>
                {brands.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
            {quoteCount > 0 && (
              <Button onClick={() => setIsQuoteModalOpen(true)} className="bg-green-600 hover:bg-green-700 whitespace-nowrap">
                <Calculator className="w-4 h-4 mr-2" /> ({quoteCount})
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Grid de Productos */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-[#004A9F] animate-spin mb-2" />
            <p className="text-gray-500">Consultando base de datos...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 text-lg">No se encontraron productos que coincidan con tu búsqueda.</p>
            <Button variant="link" onClick={() => {setSearchTerm(''); setSelectedCategory('all'); setSelectedBrand('all');}}>
              Limpiar filtros
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:border-[#004A9F] transition-all shadow-sm flex flex-col h-full">
                <div className="h-48 bg-white relative overflow-hidden border-b">
                  <img 
                    src={getProductImageByType(product)} 
                    alt={product.name} 
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform"
                    onError={(e) => { e.target.src = '/images/marcas/generico.png' }}
                  />
                  <Badge className="absolute top-2 right-2 bg-[#004A9F]">{product.brand}</Badge>
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-sm font-bold h-10 line-clamp-2">{product.name}</CardTitle>
                  <CardDescription className="text-xs">SKU: {product.sku}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 mt-auto flex justify-between items-center">
                  <span className="text-xl font-bold text-[#D71920]">${Number(product.price).toFixed(2)}</span>
                  <Button size="sm" onClick={() => handleAddToCart(product)} className="bg-[#004A9F] hover:bg-[#003370]">
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
    </div>
  );
};

export default Products;
