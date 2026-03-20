import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Search, ShoppingCart, Calculator, Loader2, Tag, CheckCircle2 } from 'lucide-react';
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

  const categories = useMemo(() => [...new Set(products.map(p => p.type))].filter(Boolean).sort(), [products]);
  const brands = useMemo(() => [...new Set(products.map(p => p.brand))].filter(Boolean).sort(), [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' || 
        product.name.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower) ||
        product.sku.toLowerCase().includes(searchLower);
      const matchesCategory = selectedCategory === 'all' || product.type === selectedCategory;
      const matchesBrand = selectedBrand === 'all' || product.brand === selectedBrand;
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
    <div className="min-h-screen bg-gray-50 font-helvetica pb-10">
      <div className="bg-gradient-to-r from-[#004A9F] to-[#D71920] text-white py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Catálogo de Productos</h1>
        <p className="text-lg opacity-90 mb-6">Productos de calidad premium para el cuidado de tu vehículo</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Badge className="bg-white/20 text-white border-0 py-1 px-3"><CheckCircle2 className="w-3 h-3 mr-1" /> Marcas reconocidas</Badge>
          <Badge className="bg-white/20 text-white border-0 py-1 px-3"><CheckCircle2 className="w-3 h-3 mr-1" /> Garantía de calidad</Badge>
          <Badge className="bg-white/20 text-white border-0 py-1 px-3"><CheckCircle2 className="w-3 h-3 mr-1" /> Precios competitivos</Badge>
        </div>
      </div>

      <div className="bg-white shadow-md border-b sticky top-0 z-20 px-4 py-4 container mx-auto flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Buscar por productos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-12" />
        </div>
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48 h-12 bg-white"><SelectValue placeholder="Todas las categorías" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger className="w-40 h-12 bg-white"><SelectValue placeholder="Todas las marcas" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las marcas</SelectItem>
              {brands.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
          {quoteCount > 0 && (
            <Button onClick={() => setIsQuoteModalOpen(true)} className="bg-green-600 h-12">
              <Calculator className="w-4 h-4 mr-2" /> ({quoteCount})
            </Button>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <p className="text-gray-600 mb-6 font-medium text-center">Mostrando {filteredProducts.length} productos</p>
        {loading ? (
          <div className="flex flex-col items-center py-20">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-2" />
            <p className="text-gray-500">Cargando inventario...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden border-0 shadow-lg flex flex-col h-full bg-white group">
                <div className="relative h-64 p-6 flex items-center justify-center border-b">
                  <Badge className="absolute top-4 left-4 bg-white text-gray-700 border shadow-sm">{product.type}</Badge>
                  <Badge className="absolute top-4 right-4 bg-[#004A9F]">{product.brand}</Badge>
                  <img src={getProductImageByType(product)} alt={product.name} className="max-h-full object-contain transform group-hover:scale-110 transition-transform" onError={(e) => e.target.src = '/images/marcas/generico.png'} />
                </div>
                <CardContent className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-[#D71920] text-center mb-2 min-h-[3.5rem] line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-gray-500 text-center mb-4 italic">Lubrica el motor y mejora el rendimiento general.</p>
                  
                  <div className="space-y-2 mb-6 border-t pt-4">
                    <div className="flex justify-between text-sm"><span className="text-gray-500 font-bold">SKU:</span><span className="font-mono">{product.sku}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500 font-bold">Tipo:</span><Badge variant="outline" className="text-[10px]">{product.type}</Badge></div>
                    <div className="text-center pt-2">
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Usos recomendados:</span>
                      <p className="text-xs text-gray-600">Motores de autos, motos o maquinaria</p>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="text-center mb-4"><span className="text-3xl font-black text-[#D71920]">${Number(product.price).toFixed(2)}</span></div>
                    <div className="grid grid-cols-5 gap-2">
                      <Button 
                        onClick={() => window.open(`https://wa.me/50766385935?text=Hola, me interesa el producto: ${product.name} (SKU: ${product.sku})`, '_blank')} 
                        className="col-span-4 bg-[#D71920] hover:bg-[#b01319] font-bold h-12"
                      >
                        <Tag className="w-4 h-4 mr-2" /> Pedir
                      </Button>
                      <Button variant="outline" onClick={() => handleAddToCart(product)} className="col-span-1 border-gray-200 h-12">
                        <ShoppingCart className="w-5 h-5 text-[#004A9F]" />
                      </Button>
                    </div>
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
