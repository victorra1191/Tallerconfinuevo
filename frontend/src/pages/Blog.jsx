import React, { useState, useEffect } from 'react';
import { Clock, User, ArrowRight, Search, Tag, Calendar, Eye, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';

const Blog = () => {
  const { toast } = useToast();
  const [blogPosts, setBlogPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showFullPost, setShowFullPost] = useState(false);

  useEffect(() => {
    loadBlogPosts();
    loadCategories();
  }, []);

  const loadBlogPosts = async () => {
    try {
      const response = await fetch('/api/blog/posts');
      if (response.ok) {
        const posts = await response.json();
        setBlogPosts(posts);
      } else {
        throw new Error('Error cargando posts');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error cargando posts del blog",
        variant: "destructive"
      });
      setBlogPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/blog/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(['all', ...data.categories]);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories(['all', 'Mantenimiento', 'Productos', 'Servicios']);
    }
  };

  const handleReadMore = async (post) => {
    try {
      await fetch(`/api/blog/posts/${post.id}`, { method: 'GET' });
      setSelectedPost(post);
      setShowFullPost(true);
    } catch (error) {
      console.error('Error loading post:', error);
      setSelectedPost(post);
      setShowFullPost(true);
    }
  };

  const handleBackToBlog = () => {
    setShowFullPost(false);
    setSelectedPost(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#D71920] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando blog...</p>
        </div>
      </div>
    );
  }

  if (showFullPost && selectedPost) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-[#004A9F] to-[#D71920] text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Button
                onClick={handleBackToBlog}
                variant="outline"
                className="mb-6 text-white border-white hover:bg-white hover:text-[#004A9F]"
              >
                ← Volver al Blog
              </Button>
              
              <div className="flex items-center space-x-4 mb-4">
                <Badge className="bg-white/20 text-white border-white">
                  {selectedPost.category}
                </Badge>
                <div className="flex items-center text-white/80 text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{formatDate(selectedPost.created_at)}</span>
                </div>
                <div className="flex items-center text-white/80 text-sm">
                  <User className="w-4 h-4 mr-2" />
                  <span>{selectedPost.author}</span>
                </div>
                <div className="flex items-center text-white/80 text-sm">
                  <Eye className="w-4 h-4 mr-2" />
                  <span>{selectedPost.view_count || 0} vistas</span>
                </div>
                <div className="flex items-center text-white/80 text-sm">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{selectedPost.read_time}</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4 font-helvetica">
                {selectedPost.title}
              </h1>
              
              <p className="text-xl text-white/90 font-helvetica">
                {selectedPost.excerpt}
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 lg:p-12">
                {selectedPost.featured_image && (
                  <img
                    src={selectedPost.featured_image}
                    alt={selectedPost.title}
                    className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
                  />
                )}
                
                <div 
                  className="prose prose-lg max-w-none text-justify"
                  style={{ textAlign: 'justify', lineHeight: '1.8' }}
                  dangerouslySetInnerHTML={{ 
                    __html: selectedPost.content.replace(/\n/g, '<br>') 
                  }}
                />
                
                {selectedPost.tags && selectedPost.tags.length > 0 && (
                  <div className="mt-8 pt-8 border-t">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Tags:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPost.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-[#004A9F] border-[#004A9F]">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-8 pt-8 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#D71920] to-[#004A9F] rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 font-helvetica">{selectedPost.author}</p>
                        <p className="text-gray-500 text-sm font-helvetica">Experto Automotriz</p>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => {
                        const message = encodeURIComponent(
                          `Hola! Leí el artículo "${selectedPost.title}" en su blog y me gustaría obtener más información sobre este tema.`
                        );
                        window.open(`https://wa.me/50766385935?text=${message}`, '_blank');
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      Contactar por WhatsApp
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#004A9F] to-[#D71920] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-helvetica">
              Blog Automotriz
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 font-helvetica">
              Consejos, tips y noticias del mundo automotriz
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="px-4 py-2 text-lg bg-white/20 text-white hover:bg-white/30">
                ✓ Consejos de expertos
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-lg bg-white/20 text-white hover:bg-white/30">
                ✓ Guías de mantenimiento
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-lg bg-white/20 text-white hover:bg-white/30">
                ✓ Novedades del sector
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar artículos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 font-helvetica"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`${
                    selectedCategory === category
                      ? 'bg-[#D71920] hover:bg-[#b01319] text-white'
                      : 'border-[#004A9F] text-[#004A9F] hover:bg-[#004A9F] hover:text-white'
                  } font-helvetica`}
                >
                  {category === 'all' ? 'Todos' : category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {filteredPosts.length > 0 && filteredPosts.some(post => post.featured) && (
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 font-helvetica">Artículos Destacados</h2>
            <p className="text-gray-600 font-helvetica">Los artículos más importantes de nuestro blog</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {filteredPosts.filter(post => post.featured).slice(0, 2).map((post) => (
              <Card key={post.id} className="border-0 shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                <div className="relative">
                  {post.featured_image ? (
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-[#D71920]/10 to-[#004A9F]/10 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📖</div>
                        <Badge className="bg-[#D71920] text-white">
                          {post.category}
                        </Badge>
                      </div>
                    </div>
                  )}
                  <Badge className="absolute top-4 left-4 bg-yellow-500 text-black">
                    <Star className="w-3 h-3 mr-1" />
                    Destacado
                  </Badge>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-3">
                    <Badge className="bg-[#D71920] text-white font-helvetica">
                      {post.category}
                    </Badge>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="font-helvetica">{formatDate(post.created_at)}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 font-helvetica line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 mb-4 font-helvetica line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#D71920] to-[#004A9F] rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 font-helvetica">{post.author}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Eye className="w-3 h-3 mr-1" />
                          <span>{post.view_count || 0} vistas</span>
                          <span className="mx-2">•</span>
                          <Clock className="w-3 h-3 mr-1" />
                          <span>{post.read_time}</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleReadMore(post)}
                      className="bg-[#004A9F] hover:bg-[#003875] text-white font-helvetica"
                    >
                      Leer Más
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 pb-16">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 font-helvetica">
            {filteredPosts.some(post => post.featured) ? 'Más Artículos' : 'Todos los Artículos'}
          </h2>
          <p className="text-gray-600 font-helvetica">
            Mostrando {filteredPosts.length} artículo{filteredPosts.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.filter(post => !post.featured).map((post, index) => (
            <Card
              key={post.id}
              className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-0 bg-white overflow-hidden cursor-pointer"
              onClick={() => handleReadMore(post)}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <CardHeader className="p-0">
                {post.featured_image ? (
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <div className="text-center">
                      <div className="text-4xl mb-2">
                        {post.category === 'Mantenimiento' && '🔧'}
                        {post.category === 'Productos' && '🛢️'}
                        {post.category === 'Servicios' && '⚙️'}
                        {!['Mantenimiento', 'Productos', 'Servicios'].includes(post.category) && '📰'}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardHeader>

              <CardContent className="p-6">
                <div className="flex items-center justify-between text-gray-500 text-sm mb-3">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="font-helvetica">{formatDate(post.created_at)}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      <span>{post.view_count || 0}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{post.read_time}</span>
                    </div>
                  </div>
                </div>

                <CardTitle className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#D71920] transition-colors duration-300 font-helvetica line-clamp-2">
                  {post.title}
                </CardTitle>

                <CardDescription className="text-gray-600 mb-4 font-helvetica line-clamp-3">
                  {post.excerpt}
                </CardDescription>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#D71920] to-[#004A9F] rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-gray-700 font-helvetica">{post.author}</span>
                  </div>

                  <Badge className="bg-[#004A9F] text-white font-helvetica">
                    {post.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 font-helvetica">
              No se encontraron artículos
            </h3>
            <p className="text-gray-600 mb-6 font-helvetica">
              {blogPosts.length === 0 
                ? 'Aún no hay artículos publicados. ¡Vuelve pronto para nuevo contenido!'
                : 'Intenta ajustar tu búsqueda o seleccionar otra categoría'
              }
            </p>
            <Button
              onClick={() => {
                const message = encodeURIComponent('Hola! Me gustaría conocer cuándo publican nuevo contenido en el blog.');
                window.open(`https://wa.me/50766385935?text=${message}`, '_blank');
              }}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Consultar por WhatsApp
            </Button>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-helvetica">
            Mantente Informado
          </h2>
          <p className="text-xl mb-8 text-gray-300 max-w-3xl mx-auto font-helvetica">
            Recibe consejos automotrices, tips de mantenimiento y ofertas especiales 
            directamente en tu WhatsApp
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <Button
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 font-helvetica"
              onClick={() => {
                const message = encodeURIComponent('Hola! Me gustaría suscribirme para recibir consejos automotrices y ofertas especiales.');
                window.open(`https://wa.me/50766385935?text=${message}`, '_blank');
              }}
            >
              Suscribirse por WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;