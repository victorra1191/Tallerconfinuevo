import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Search, ShoppingCart, Calculator, Loader2, CheckCircle2, Package, Tag, Info } from 'lucide-react';
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
        const baseUrl = process.env.REACT_APP_API_URL || '/api';
        const cleanUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        const response = await axios.get(`${cleanUrl}/products`);
        setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error de conexión:", error);
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

  const categories = useMemo(() => [...new Set(products.map(p => p.type))].sort(), [products]);
  const brands = useMemo(() => [...new Set(products.map(p => p.brand))].sort(), [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' || 
        product.name.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower) ||
        product.sku.toLowerCase().includes(searchLower);
      const matchesCategory = selectedCategory === 'all' || product.type === selectedCategory;
      const matchesBrand = selectedBrand === 'all' || product.brand === selectedBrand;
      return matchesSearch && matchesCategory && matchesBrand;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return a.name.localeCompare(b.name);
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
    toast({ title: "Agregado", description: `${product.name} a la lista de cotización.` });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-helvetica pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#004A9F] to-[#D71920] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Catálogo de Productos</h1>
          <p className="text-xl mb-8 opacity-90">Productos de calidad premium para el cuidado de tu vehículo</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge className="bg-white/20 text-white border-0 px-4 py-2 text-sm"><CheckCircle2 className="w-4 h-4 mr-2" /> Marcas reconocidas</Badge>
            <Badge className="bg-white/20 text-white border-0 px-4 py-2 text-sm"><CheckCircle2 className="w-4 h-4 mr-2" /> Garantía de calidad</Badge>
            <Badge className="bg-white/20 text-white border-0 px-4 py-2 text-sm"><CheckCircle2 className="w-4 h-4 mr-2" /> Precios competitivos</Badge>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white shadow-md border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48 h-12"><SelectValue placeholder="Todas las categorías" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="w-full sm:w-48 h-12"><SelectValue placeholder="Todas las marcas" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las marcas</SelectItem>
                {brands.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
            {quoteCount > 0 && (
              <Button onClick={() => setIsQuoteModalOpen(true)} className="bg-green-600 hover:bg-green-700 h-12 px-6">
                <Calculator className="w-5 h-5 mr-2" /> ({quoteCount})
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-10">
        <p className="text-gray-600 mb-8 font-medium">Mostrando {filteredProducts.length} productos</p>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-12 h-12 text-[#004A9F] animate-spin mb-4" />
            <p className="text-gray-500 text-xl">Consultando base de datos Neon...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group bg-white flex flex-col">
                {/* Product Image Area */}
                <div className="relative h-64 bg-white p-6 flex items-center justify-center border-b group-hover:bg-gray-50 transition-colors">
                  <Badge className="absolute top-4 left-4 bg-white text-gray-800 border shadow-sm px-3 py-1">{product.type}</Badge>
                  <Badge className="absolute top-4 right-4 bg-[#004A9F] text-white px-3 py-1">{product.brand}</Badge>
                  <img 
                    src={getProductImageByType(product)} 
                    alt={product.name} 
                    className="max-w-full max-h-full object-contain transform group-hover:scale-110 transition-transform duration-500" 
                    onError={(e) => { e.target.src = '/images/marcas/generico.png' }}
                  />
                </div>

                {/* Content */}
                <CardContent className="p-6 flex flex-col flex-1">
                  <div className="mb-4 text-center">
                    <h3 className="text-xl font-bold text-[#D71920] mb-2 line-clamp-2 min-h-[3.5rem] flex items-center justify-center">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 italic">Lubrica el motor y mejora el rendimiento general.</p>
                  </div>

                  <div className="space-y-3 mb-6 border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">SKU:</span>
                      <span className="text-gray-900 font-mono">{product.sku}</span>
                    </div>
                    <div
