import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Eye, EyeOff, Search, Filter,
  Calendar, User, Tag, Image, Save, X
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../hooks/use-toast';

const BlogManager = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [postForm, setPostForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    featured_image: '',
    gallery_images: [],
    tags: [],
    read_time: '',
    published: true,
    featured: false,
    seo_title: '',
    seo_description: ''
  });

  useEffect(() => {
    loadBlogPosts();
    loadCategories();
  }, []);

  const loadBlogPosts = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/blog/posts?published_only=false', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error cargando posts del blog",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/blog/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleCreatePost = () => {
    setEditingPost(null);
    setPostForm({
      title: '',
      excerpt: '',
      content: '',
      author: '',
      category: '',
      featured_image: '',
      gallery_images: [],
      tags: [],
      read_time: '',
      published: true,
      featured: false,
      seo_title: '',
      seo_description: ''
    });
    setShowEditor(true);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setPostForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      category: post.category,
      featured_image: post.featured_image || '',
      gallery_images: post.gallery_images || [],
      tags: post.tags || [],
      read_time: post.read_time,
      published: post.published,
      featured: post.featured || false,
      seo_title: post.seo_title || '',
      seo_description: post.seo_description || ''
    });
    setShowEditor(true);
  };

  const handleSavePost = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const url = editingPost 
        ? `/api/admin/blog/posts/${editingPost.id}`
        : '/api/admin/blog/posts';
      
      const method = editingPost ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postForm)
      });

      if (response.ok) {
        toast({
          title: "Éxito",
          description: editingPost ? "Post actualizado" : "Post creado",
        });
        setShowEditor(false);
        loadBlogPosts();
      } else {
        throw new Error('Error guardando el post');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este post?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/blog/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Post eliminado",
        });
        loadBlogPosts();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error eliminando el post",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field, value) => {
    setPostForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagsChange = (tagsString) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    handleInputChange('tags', tags);
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#D71920]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!showEditor ? (
        <>
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gestión del Blog</h2>
              <p className="text-gray-600">Administra los artículos de tu blog</p>
            </div>
            <Button
              onClick={handleCreatePost}
              className="bg-[#D71920] hover:bg-[#b01319] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Post
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="w-full md:w-64">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D71920] focus:border-transparent"
                  >
                    <option value="all">Todas las categorías</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts List */}
          <div className="grid gap-6">
            {filteredPosts.map(post => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                        {post.featured && (
                          <Badge className="bg-yellow-100 text-yellow-800">Destacado</Badge>
                        )}
                        <Badge variant={post.published ? "default" : "secondary"}>
                          {post.published ? "Publicado" : "Borrador"}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{post.excerpt}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(post.created_at).toLocaleDateString('es-ES')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Tag className="w-4 h-4" />
                          <span>{post.category}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{post.view_count || 0} vistas</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        onClick={() => handleEditPost(post)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeletePost(post.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">No se encontraron posts</p>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        /* Editor */
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {editingPost ? 'Editar Post' : 'Nuevo Post'}
                </CardTitle>
                <CardDescription>
                  Crea o edita un artículo para tu blog
                </CardDescription>
              </div>
              <Button
                onClick={() => setShowEditor(false)}
                variant="outline"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título *
                </label>
                <Input
                  value={postForm.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Título del post"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Autor *
                </label>
                <Input
                  value={postForm.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  placeholder="Nombre del autor"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <Input
                  value={postForm.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  placeholder="Categoría"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiempo de lectura
                </label>
                <Input
                  value={postForm.read_time}
                  onChange={(e) => handleInputChange('read_time', e.target.value)}
                  placeholder="ej: 5 min"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (separados por comas)
                </label>
                <Input
                  value={postForm.tags.join(', ')}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder="tag1, tag2, tag3"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Extracto *
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D71920] focus:border-transparent"
                rows="3"
                value={postForm.excerpt}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                placeholder="Breve descripción del post"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenido *
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D71920] focus:border-transparent"
                style={{ textAlign: 'justify', lineHeight: '1.6' }}
                rows="12"
                value={postForm.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Contenido completo del post (puedes usar HTML básico)"
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 Tip: El texto se mostrará justificado automáticamente en el blog
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen destacada (URL)
              </label>
              <Input
                value={postForm.featured_image}
                onChange={(e) => handleInputChange('featured_image', e.target.value)}
                placeholder="URL de la imagen destacada"
              />
            </div>

            {/* SEO Section */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">SEO</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título SEO
                  </label>
                  <Input
                    value={postForm.seo_title}
                    onChange={(e) => handleInputChange('seo_title', e.target.value)}
                    placeholder="Título optimizado para SEO"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción SEO
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D71920] focus:border-transparent"
                    rows="2"
                    value={postForm.seo_description}
                    onChange={(e) => handleInputChange('seo_description', e.target.value)}
                    placeholder="Meta descripción para motores de búsqueda"
                  />
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Opciones</h4>
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={postForm.published}
                    onChange={(e) => handleInputChange('published', e.target.checked)}
                    className="rounded border-gray-300 text-[#D71920] focus:ring-[#D71920]"
                  />
                  <span className="text-sm text-gray-700">Publicar inmediatamente</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={postForm.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    className="rounded border-gray-300 text-[#D71920] focus:ring-[#D71920]"
                  />
                  <span className="text-sm text-gray-700">Post destacado</span>
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                onClick={() => setShowEditor(false)}
                variant="outline"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSavePost}
                className="bg-[#D71920] hover:bg-[#b01319] text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingPost ? 'Actualizar' : 'Crear'} Post
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BlogManager;