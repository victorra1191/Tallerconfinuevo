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

  // Lógica de filtrado y renderizado...
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = searchTerm === '' || p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || p.type === selectedCategory;
      const matchesBrand = selectedBrand === 'all' || p.brand === selectedBrand;
      return matchesSearch && matchesCategory && matchesBrand;
    });
  }, [searchTerm, selectedCategory, selectedBrand, products]);

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
      <div className="bg-gradient-to-r from-[#004A9F] to-[#D71920] text-white py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Catálogo de Productos</h1>
        <p className="text-lg opacity-90">Sincronizado con Neon</p>
      </div>
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center py-20">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-2" />
            <p className="text-gray-500">Consultando Neon...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:border-[#004A9F] transition-all">
                <div className="h-40 bg-white relative">
                  <img src={getProductImageByType(product)} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-105" onError={(e) => { e.target.src = '/images/marcas/generico.png' }} />
                  <Badge className="absolute top-2 right-2 bg-[#004A9F]">{product.brand}</Badge>
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-sm font-bold line-clamp-2">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex justify-between items-center">
                  <span className="text-xl font-bold text-[#D71920]">${Number(product.price).toFixed(2)}</span>
                  <Button size="sm" onClick={() => handleAddToCart(product)} className="bg-[#004A9F]">
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
