import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Search, ShoppingCart, Calculator, Loader2, Tag, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import QuoteModal from '../components/QuoteModal';

const Products = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  
  // Estados del carrito/cotización
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteCount, setQuoteCount] = useState(0);

  // NUEVO: Estados de Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15;

  // Traer productos de Neon/Python
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Ruta relativa para evitar CORS en Vercel
        const response = await axios.get('/api/products');
        
        // Verificación de seguridad
        if (response.data && Array.isArray(response.data)) {
           setProducts(response.data);
        } else if (response.data && Array.isArray(response.data.products)) {
           setProducts(response.data.products);
        } else {
           setProducts([]);
        }
      } catch (error) {
        console.error("Error de conexión:", error);
        toast({
          variant: "destructive",
          title: "Error de inventario",
          description: "No se pudo conectar con la base de datos.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Actualizar contador del carrito
  useEffect(() => {
    const updateQuoteCount = () => {
      const saved = JSON.parse(localStorage.getItem('quoteList') || '[]');
      setQuoteCount(saved.reduce((total, item) => total + (item.quantity || 1), 0));
    };
    updateQuoteCount();
    window.addEventListener('storage', updateQuoteCount);
    return () => window.removeEventListener('storage', updateQuoteCount);
  }, []);

  // NUEVO: Resetear a la página 1 si el usuario busca o filtra algo
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedBrand]);

  // Extraer categorías y marcas únicas para los filtros
  const categories = useMemo(() => [...new Set(products.map(p => p.type))].filter(Boolean).sort(), [products]);
  const brands = useMemo(() => [...new Set(products.map(p => p.brand))].filter(Boolean).sort(), [products]);

  // Filtrar productos según búsqueda y selects
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' || 
        (product.name || '').toLowerCase().includes(searchLower) ||
        (product.brand || '').toLowerCase().includes(searchLower) ||
        (product.sku || '').toLowerCase().includes(searchLower);
      const matchesCategory = selectedCategory === 'all' || product.type === selectedCategory;
      const matchesBrand = selectedBrand === 'all' || product.brand === selectedBrand;
      return matchesSearch && matchesCategory && matchesBrand;
    });
  }, [searchTerm, selectedCategory, selectedBrand, products]);

  // NUEVO: Lógica matemática para la paginación
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

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
      {/* HEADER HERO */}
      <div className="bg-gradient-to-r from-[#004A9F] to-[#D71920] text-white py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Catálogo de Productos</h1>
          <p className="text-lg opacity-90 mb-6">Productos de calidad premium para el cuidado de tu vehículo</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Badge className="bg-white/20 text-white border-0 py-1 px-3"><CheckCircle2 className="w-3 h-3 mr-1" /> Marcas reconocidas</Badge>
            <Badge className="bg-white/20 text-white border-0 py-1 px-3"><CheckCircle2 className="w-3 h-3 mr-1" /> Garantía de calidad</Badge>
            <Badge className="bg-white/20 text-white border-0 py-1 px-3"><CheckCircle2 className="w-3 h-3 mr-1" /> Precios competitivos</Badge>
          </div>
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA Y FILTROS PRINCIPALES */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-20 px-4 py-4">
        <div className="container mx-auto flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Buscar por nombre, marca o SKU..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-12" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 h-12 bg-white flex-shrink-0"><SelectValue placeholder="Categorías" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="w-40 h-12 bg-white flex-shrink-0"><SelectValue placeholder="Marcas" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las marcas</SelectItem>
                {brands.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
            {quoteCount > 0 && (
              <Button onClick={() => setIsQuoteModalOpen(true)} className="bg-green-600 h-12 flex-shrink-0">
                <Calculator className="w-4 h-4 mr-2" /> ({quoteCount})
              </Button>
            )}
          </div>
        </div>

        {/* NUEVO: BOTONES DE CATEGORÍAS RÁPIDAS */}
        <div className="container mx-auto mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Button 
            variant={selectedCategory === 'all' ? 'default' : 'outline'} 
            onClick={() => setSelectedCategory('all')}
            className={selectedCategory === 'all' ? 'bg-[#004A9F]' : 'whitespace-nowrap'}
          >
            Todo el inventario
          </Button>
          {categories.slice(0, 6).map(category => ( // Muestra las primeras 6 para no saturar
            <Button 
              key={category} 
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? 'bg-[#D71920]' : 'whitespace-nowrap text-gray-600'}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* GRID DE PRODUCTOS */}
      <div className="container mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-6 text-gray-600 font-medium">
          <p>Mostrando {filteredProducts.length} productos en total</p>
          {totalPages > 1 && <p>Página {currentPage} de {totalPages}</p>}
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center py-20">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-2" />
            <p className="text-gray-500">Cargando inventario...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">No se encontraron productos con esos filtros.</p>
            <Button variant="link" onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setSelectedBrand('all'); }}>Limpiar filtros</Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* ATENCIÓN: Ahora mapeamos currentProducts, no filteredProducts */}
              {currentProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden border border-gray-100 shadow-md hover:shadow-xl flex flex-col h-full bg-white group transition-all duration-300">
                  <div className="relative h-56 p-4 flex items-center justify-center border-b bg-white">
                    <Badge className="absolute top-3 left-3 bg-white text-gray-700 border shadow-sm text-xs">{product.type}</Badge>
                    <Badge className="absolute top-3 right-3 bg-[#004A9F] text-xs">{product.brand}</Badge>
                    <img 
                      src={product.image || '/images/marcas/generico.png'} 
                      alt={product.name} 
                      className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300" 
                      onError={(e) => { e.target.onerror = null; e.target.src = '/images/marcas/generico.png' }} 
                    />
                  </div>
                  <CardContent className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]" title={product.name}>
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-4 line-clamp-2 min-h-[2rem]">
                      {product.description || "Producto automotriz de alta calidad."}
                    </p>
                    
                    <div className="space-y-2 mb-4 border-t pt-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400 font-semibold uppercase">SKU</span>
                        <span className="font-mono font-bold text-gray-700">{product.sku}</span>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-black text-[#D71920]">${Number(product.price).toFixed(2)}</span>
                        {product.in_stock ? (
                          <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">En Stock</span>
                        ) : (
                          <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">Agotado</span>
                        )}
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        <Button 
                          onClick={() => window.open(`https://wa.me/50766385935?text=Hola, me interesa el producto: ${product.name} (SKU: ${product.sku}) por un precio de $${product.price}`, '_blank')} 
                          className="col-span-4 bg-[#D71920] hover:bg-[#b01319] font-bold text-white shadow-sm"
                        >
                          <Tag className="w-4 h-4 mr-2" /> Pedir
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => handleAddToCart(product)} 
                          className="col-span-1 border-gray-200 hover:bg-gray-50 flex items-center justify-center px-0"
                          disabled={!product.in_stock}
                        >
                          <ShoppingCart className="w-4 h-4 text-[#004A9F]" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* NUEVO: CONTROLES DE PAGINACIÓN */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12 pt-8 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setCurrentPage(p => Math.max(1, p - 1));
                    window.scrollTo({ top: 300, behavior: 'smooth' }); // Sube un poco la pantalla al cambiar de página
                  }}
                  disabled={currentPage === 1}
                  className="w-24"
                >
                  Anterior
                </Button>
                
                <div className="flex gap-1">
                  {/* Botones numéricos de página (simplificado para móviles) */}
                  <span className="bg-[#004A9F] text-white px-4 py-2 rounded-md font-bold">
                    {currentPage}
                  </span>
                  <span className="px-2 py-2 text-gray-400">de {totalPages}</span>
                </div>

                <Button 
                  variant="outline" 
                  onClick={() => {
                    setCurrentPage(p => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                  className="w-24"
                >
                  Siguiente
                </Button>
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
