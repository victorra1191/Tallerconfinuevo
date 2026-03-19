import React, { useState, useMemo } from 'react';
import { Search, Filter, ShoppingCart, Star, Zap, Calculator } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { products, mockFunctions, getProductImageByType } from '../data/mockData';
import { useToast } from '../hooks/use-toast';
import QuoteModal from '../components/QuoteModal';

const Products = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteCount, setQuoteCount] = useState(0);

  // Update quote count on component mount and when localStorage changes
  React.useEffect(() => {
    const updateQuoteCount = () => {
      const quoteList = mockFunctions.getQuoteList();
      setQuoteCount(quoteList.reduce((total, item) => total + item.quantity, 0));
    };
    
    updateQuoteCount();
    window.addEventListener('storage', updateQuoteCount);
    return () => window.removeEventListener('storage', updateQuoteCount);
  }, []);

  // Get unique categories, brands, and uses
  const categories = [...new Set(products.map(p => p.type))];
  const brands = [...new Set(products.map(p => p.brand))];
  const uses = [...new Set(products.flatMap(p => p.keywords || []))];

  // Advanced filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Advanced search in multiple fields
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' || 
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower) ||
        product.type.toLowerCase().includes(searchLower) ||
        product.uses.toLowerCase().includes(searchLower) ||
        product.keywords?.some(keyword => keyword.toLowerCase().includes(searchLower)) ||
        product.sku.toLowerCase().includes(searchLower);
      
      const matchesCategory = selectedCategory === 'all' || product.type === selectedCategory;
      const matchesBrand = selectedBrand === 'all' || product.brand === selectedBrand;
      
      return matchesSearch && matchesCategory && matchesBrand;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'brand':
          return a.brand.localeCompare(b.brand);
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, selectedBrand, sortBy]);

  const handleAddToCart = (product) => {
    const updatedList = mockFunctions.addToQuoteList(product);
    setQuoteCount(updatedList.reduce((total, item) => total + item.quantity, 0));
    toast({
      title: "Producto agregado",
      description: `${product.name} se agregó a tu lista de cotización.`,
    });
  };

  const handleQuickOrder = (product) => {
    const message = encodeURIComponent(
      `Hola! Me interesa el producto: ${product.name} (SKU: ${product.sku}). ¿Podrían darme más información sobre disponibilidad y precio?`
    );
    window.open(`https://wa.me/50766385935?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#004A9F] to-[#D71920] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-helvetica">
              Catálogo de Productos
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 font-helvetica">
              Productos de calidad premium para el cuidado de tu vehículo
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="px-4 py-2 text-lg bg-white/20 text-white hover:bg-white/30">
                ✓ Marcas reconocidas
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-lg bg-white/20 text-white hover:bg-white/30">
                ✓ Garantía de calidad
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-lg bg-white/20 text-white hover:bg-white/30">
                ✓ Precios competitivos
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 font-helvetica"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 font-helvetica">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="w-40 font-helvetica">
                  <SelectValue placeholder="Marca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las marcas</SelectItem>
                  {brands.map(brand => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 font-helvetica">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nombre A-Z</SelectItem>
                  <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
                  <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
                  <SelectItem value="brand">Marca</SelectItem>
                </SelectContent>
              </Select>

              {/* Quote Button */}
              {quoteCount > 0 && (
                <Button
                  onClick={() => setIsQuoteModalOpen(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 font-helvetica relative"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Cotizar ({quoteCount})
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1">
                    {quoteCount}
                  </Badge>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <p className="text-gray-600 font-helvetica">
            Mostrando {filteredProducts.length} productos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <Card
              key={product.id}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white overflow-hidden"
              style={{
                animationDelay: `${index * 0.05}s`
              }}
            >
              <CardHeader className="relative p-4">
                {/* Product Image */}
                <div className="w-full h-48 rounded-lg mb-4 overflow-hidden group-hover:scale-105 transition-transform duration-300 bg-gray-100">
                  <img 
                    src={getProductImageByType(product)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1559416814-85b0a9b2af76?w=300&h=300&fit=crop';
                    }}
                  />
                  {/* Product Category Badge */}
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md">
                    <span className="text-xs font-semibold text-gray-800 font-helvetica">{product.type}</span>
                  </div>
                </div>
                
                {/* Brand Badge */}
                <Badge 
                  variant="secondary" 
                  className="absolute top-6 right-6 bg-[#004A9F] text-white hover:bg-[#003875]"
                >
                  {product.brand}
                </Badge>

                <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-[#D71920] transition-colors duration-300 font-helvetica line-clamp-2">
                  {product.name}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 font-helvetica line-clamp-2">
                  {product.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 pt-0 space-y-4">
                {/* Product Details */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 font-helvetica">SKU:</span>
                    <span className="text-gray-900 font-helvetica">{product.sku}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 font-helvetica">Tipo:</span>
                    <Badge variant="outline" className="text-xs">{product.type}</Badge>
                  </div>
                </div>

                {/* Uses */}
                <div className="text-sm">
                  <span className="text-gray-500 mb-1 block font-helvetica">Usos recomendados:</span>
                  <p className="text-gray-700 text-xs font-helvetica">{product.uses}</p>
                </div>

                {/* Price */}
                <div className="border-t pt-4">
                  <div className="text-2xl font-bold text-[#D71920] font-helvetica">
                    ${product.price.toFixed(2)}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button
                    onClick={() => handleQuickOrder(product)}
                    className="flex-1 bg-[#D71920] hover:bg-[#b01319] text-white text-sm font-helvetica"
                  >
                    <Zap className="w-4 h-4 mr-1" />
                    Pedir
                  </Button>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    variant="outline"
                    className="px-3 border-[#004A9F] text-[#004A9F] hover:bg-[#004A9F] hover:text-white"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 font-helvetica">
              No se encontraron productos
            </h3>
            <p className="text-gray-600 font-helvetica">
              Intenta ajustar los filtros o la búsqueda
            </p>
          </div>
        )}
      </div>

      {/* Brands Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-helvetica">
              Marcas que Manejamos
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-helvetica">
              Trabajamos con las mejores marcas del mercado automotriz
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {['Motul', 'Wurth', 'A1', 'ENI', 'Liqui Moly', 'Genérico'].map((brand, index) => (
              <div
                key={index}
                className="text-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#D71920] to-[#004A9F] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 font-helvetica">{brand}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-helvetica">
            ¿No encuentras lo que buscas?
          </h2>
          <p className="text-xl mb-8 text-gray-300 font-helvetica">
            Contáctanos y te ayudaremos a conseguir el producto que necesitas
          </p>
          <Button
            size="lg"
            className="bg-[#D71920] hover:bg-[#b01319] text-white px-8 py-3 font-helvetica"
            onClick={() => {
              const message = encodeURIComponent('Hola! Busco un producto específico que no veo en el catálogo. ¿Podrían ayudarme?');
              window.open(`https://wa.me/50766385935?text=${message}`, '_blank');
            }}
          >
            Consultar Producto
          </Button>
        </div>
      </div>

      {/* Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />
    </div>
  );
};

export default Products;