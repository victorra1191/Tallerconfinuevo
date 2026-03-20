import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Search, ShoppingCart, Zap, Calculator, Loader2, PackageSearch } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import QuoteModal from '../components/QuoteModal';

const Products = () => {
  const { toast } = useToast();
  
  // Estados para la data de la API
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteCount, setQuoteCount] = useState(0);

  // 1. CARGA DE DATOS DESDE NEON (API)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Usamos la variable de entorno de tu .env
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/products/`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error cargando productos de Neon:", error);
        toast({
          variant: "destructive",
          title: "Error de conexión",
          description: "No pudimos cargar el catálogo. Intenta de nuevo más tarde.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [toast]);

  // 2. LÓGICA DE COTIZACIÓN (LocalStorage)
  useEffect(() => {
    const updateQuoteCount = () => {
      const savedQuotes = JSON.parse(localStorage.getItem('quoteList') || '[]');
      setQuoteCount(savedQuotes.reduce((total, item) => total + (item.quantity || 1), 0));
    };
    updateQuoteCount();
    window.addEventListener('storage', updateQuoteCount);
    return () => window.removeEventListener('storage', updateQuoteCount);
  }, []);

  // 3. GENERACIÓN DINÁMICA DE FILTROS (Basado en lo que hay en la DB)
  const categories = useMemo(() => [...new Set(products.map(p => p.type))].sort(), [products]);
  const brands = useMemo(() => [...new Set(products.map(p => p.brand))].sort(), [products]);

  // 4. FILTRADO Y ORDENAMIENTO EN TIEMPO REAL
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' || 
        product.name.toLowerCase().includes(searchLower) ||
        (product.description && product.description.toLowerCase().includes(searchLower)) ||
        product.brand.toLowerCase().includes(searchLower) ||
        product.sku.toLowerCase().includes(searchLower);
      
      const matchesCategory = selectedCategory === 'all' || product.type === selectedCategory;
      const matchesBrand = selectedBrand === 'all' || product.brand === selectedBrand;
      
      return matchesSearch && matchesCategory && matchesBrand;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'brand': return a.brand.localeCompare(b.brand);
        default: return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, selectedBrand, sortBy, products]);

  // 5. MANEJADORES DE EVENTOS
  const handleAddToCart = (product) => {
    const savedQuotes = JSON.parse(localStorage.getItem('quoteList') || '[]');
    const existing = savedQuotes.find(item => item.id === product.id);
    
    let newList;
    if (existing) {
      newList = savedQuotes.map(item => 
        item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      );
    } else {
      newList = [...savedQuotes, { ...product, quantity: 1 }];
    }

    localStorage.setItem('quoteList', JSON.stringify(newList));
    window.dispatchEvent(new Event('storage'));
    
    toast({
      title: "Agregado a cotización",
      description: `${product.name} listo para cotizar.`,
    });
  };

  const handleQuickOrder = (product) => {
    const message = encodeURIComponent(
      `¡Hola Confiautos! Me interesa el producto: ${product.name} (SKU: ${product.sku}). ¿Tienen disponibilidad?`
    );
    window.open(`https://wa.me/50766385935?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#004A9F] to-[#D71920] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-helvetica">Catálogo Confiautos</h1>
          <p className="text-xl text-white/90 font-helvetica max-w-2xl mx-auto">
            Explora nuestro inventario real de lubricantes, filtros y aditivos premium.
          </p>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white shadow-sm sticky top-0 z-10 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar por nombre, SKU o marca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue placeholder="Marca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Marcas</SelectItem>
                  {brands.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
              </Select>

              {quoteCount > 0 && (
                <Button 
                  onClick={() => setIsQuoteModalOpen(true)}
                  className="bg-green-600 hover:bg-green-700 flex-1 md:flex-none"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Cotizar ({quoteCount})
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Productos */}
      <div className="container mx-auto px-4 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#004A9F] animate-spin mb-4" />
            <p className="text-gray-500 font-helvetica">Conectando con Neon...</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <p className="text-sm text-gray-500">{filteredProducts.length} productos encontrados</p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 h-8 text-xs">
                  <SelectValue placeholder="Ordenar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nombre A-Z</SelectItem>
                  <SelectItem value="price-low">Precio más bajo</SelectItem>
                  <SelectItem value="price-high">Precio más alto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="group overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-square relative bg-gray-100">
                    <img 
                      src={product.image || '/images/marcas/generico.png'} 
                      alt={product.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform"
                    />
                    <Badge className="absolute top-2 right-2 bg-white/80 text-black backdrop-blur-sm border-none">
                      {product.brand}
                    </Badge>
                  </div>
                  
                  <CardHeader className="p-4 pb-0">
                    <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{product.type}</div>
                    <CardTitle className="text-base line-clamp-2 h-12 font-helvetica leading-tight">
                      {product.name}
                    </CardTitle>
                    <div className="text-[11px] text-gray-400">SKU: {product.sku}</div>
                  </CardHeader>

                  <CardContent className="p-4 pt-4 space-y-4">
                    <div className="text-xl font-bold text-[#D71920]">
                      ${parseFloat(product.price).toFixed(2)}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleQuickOrder(product)}
                        className="flex-1 bg-[#D71920] hover:bg-[#b01319] h-9 text-xs"
                      >
                        <Zap className="w-3 h-3 mr-1" /> Pedir
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleAddToCart(product)}
                        className="border-[#004A9F] text-[#004A9F] h-9 px-3"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed">
                <PackageSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800">No encontramos coincidencias</h3>
                <p className="text-gray-500">Prueba con otra marca o término de búsqueda.</p>
              </div>
            )}
          </>
        )}
      </div>

      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
    </div>
  );
};

export default Products;
