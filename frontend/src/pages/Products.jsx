import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Search, ShoppingCart, Zap, Calculator, Loader2, PackageSearch, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import QuoteModal from '../components/QuoteModal';

// Nota: Mantengo la lógica de imágenes por tipo que ya tenías
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

  // Carga de datos real desde el Backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || '/api';
        const response = await axios.get(`${apiUrl}/products/`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error cargando productos:", error);
        toast({
          variant: "destructive",
          title: "Error de conexión",
          description: "No pudimos conectar con el inventario de Neon.",
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

    filtered.sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

    return filtered;
  }, [searchTerm, selectedCategory, selectedBrand, sortBy, products]);

  const handleAddToCart = (product) => {
    const saved = JSON.parse(localStorage.getItem('quoteList') || '[]');
    const existing = saved.find(item => item.id === product.id);
    let newList = existing 
      ? saved.map(item => item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item)
      : [...saved, { ...product, quantity: 1 }];

    localStorage.setItem('quoteList', JSON.stringify(newList));
    window.dispatchEvent(new Event('storage'));
    toast({ title: "Producto agregado", description: `${product.name} listo para cotizar.` });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#004A9F] to-[#D71920] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-helvetica">Catálogo de Productos</h1>
          <p className="text-xl md:text-2xl mb-8 font-helvetica">Inventario real desde la base de datos Neon</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar por nombre o SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Categoría" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Marca" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las marcas</SelectItem>
                {brands.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
            {quoteCount > 0 && (
              <Button onClick={() => setIsQuoteModalOpen(true)} className="bg-green-600 hover:bg-green-700">
                <Calculator className="w-4 h-4 mr-2" /> Cotizar ({quoteCount})
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex flex-col items-center py-20">
            <Loader2 className="w-12 h-12 text-[#004A9F] animate-spin mb-4" />
            <p className="text-gray-500 font-helvetica">Cargando inventario de Neon...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-100 relative">
                  <img src={getProductImageByType(product)} alt={product.name} className="w-full h-full object-contain p-4" />
                  <Badge className="absolute top-2 right-2 bg-[#004A9F]">{product.brand}</Badge>
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-base font-bold line-clamp-2">{product.name}</CardTitle>
                  <CardDescription className="text-xs">SKU: {product.sku}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold text-[#D71920] mb-4">${product.price.toFixed(2)}</div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleAddToCart(product)} variant="outline" className="flex-1 border-[#004A9F] text-[#004A9F]">
                      <ShoppingCart className="w-4 h-4 mr-2" /> Cotizar
                    </Button>
                  </div>
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

export default Products;
