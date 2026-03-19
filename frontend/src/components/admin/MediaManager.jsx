import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Eye, Download, Search, Filter, FolderOpen, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useToast } from '../../hooks/use-toast';

const MediaManager = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['all', 'blog', 'promotions', 'products', 'services', 'brands', 'general'];

  const brandNames = [
    { key: 'motul', name: 'Motul', filename: 'motul.png' },
    { key: 'wurth', name: 'Wurth', filename: 'wurth.png' },
    { key: 'eni', name: 'ENI', filename: 'eni.png' },
    { key: 'a1', name: 'A1', filename: 'a1.png' },
    { key: 'liqui-moly', name: 'Liqui Moly', filename: 'liqui-moly.png' },
    { key: 'generico', name: 'Genérico', filename: 'generico.png' }
  ];

  useEffect(() => {
    loadMediaFiles();
  }, [selectedCategory]);

  const loadMediaFiles = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const url = selectedCategory === 'all' 
        ? '/api/admin/media' 
        : `/api/admin/media?category=${selectedCategory}`;
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setFiles(data);
      }
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event, category = 'general', brandKey = null) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      // Special handling for logo - upload directly to the logo folder
      if (category === 'logo') {
        const formData = new FormData();
        const logoFile = new File([file], 'logo-confiautos.png', { type: file.type });
        formData.append('file', logoFile);
        formData.append('category', 'logo');
        formData.append('alt_text', 'Logo Confiautos Panama');
        formData.append('description', 'Logo oficial de Confiautos Panama');

        const token = localStorage.getItem('admin_token');
        const response = await fetch('/api/admin/upload/image', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });

        if (response.ok) {
          toast({
            title: "¡Logo subido exitosamente!",
            description: "Recarga la página para ver tu logo en el header",
          });
          
          // Force reload the page to show the new logo
          setTimeout(() => {
            window.location.reload();
          }, 2000);
          
          loadMediaFiles();
        } else {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Error subiendo logo');
        }
        return;
      }

      // Special handling for brand logos
      if (category === 'brands' && brandKey) {
        const brand = brandNames.find(b => b.key === brandKey);
        if (brand) {
          const formData = new FormData();
          const brandFile = new File([file], brand.filename, { type: file.type });
          formData.append('file', brandFile);
          formData.append('category', 'brands');
          formData.append('alt_text', `Logo ${brand.name}`);
          formData.append('description', `Logo de la marca ${brand.name}`);

          const token = localStorage.getItem('admin_token');
          const response = await fetch('/api/admin/upload/image', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
          });

          if (response.ok) {
            toast({
              title: `¡Logo de ${brand.name} subido!`,
              description: "Recarga la página para ver el logo en la sección de marcas",
            });
            
            // Force reload to show the new brand logo
            setTimeout(() => {
              window.location.reload();
            }, 2000);
            
            loadMediaFiles();
          } else {
            const errorData = await response.json();
            throw new Error(errorData.detail || `Error subiendo logo de ${brand.name}`);
          }
          return;
        }
      }

      // Regular file upload
      const token = localStorage.getItem('admin_token');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      formData.append('alt_text', file.name);
      formData.append('description', `Imagen subida: ${file.name}`);

      const response = await fetch('/api/admin/upload/image', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Imagen subida correctamente",
        });
        loadMediaFiles();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error subiendo archivo');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este archivo?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/media/${fileId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Archivo eliminado",
        });
        loadMediaFiles();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error eliminando archivo",
        variant: "destructive"
      });
    }
  };

  const filteredFiles = files.filter(file =>
    file.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#D71920]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Medios</h2>
          <p className="text-gray-600">Administra las imágenes y archivos del sitio web</p>
        </div>
      </div>

      {/* Upload Logo Section */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-800">🏢 Logo de la Empresa</CardTitle>
          <CardDescription className="text-yellow-700">
            Sube el logo oficial de Confiautos para que aparezca en el header
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-yellow-300 rounded-lg p-6 text-center hover:border-yellow-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'logo')}
                className="hidden"
                id="upload-logo"
                disabled={uploading}
              />
              <label htmlFor="upload-logo" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                <p className="font-medium text-yellow-800">Subir Logo Oficial</p>
                <p className="text-sm text-yellow-600">Click para subir logo-confiautos.png</p>
              </label>
            </div>
            
            <div className="text-xs text-yellow-700 space-y-1">
              <p><strong>Especificaciones del logo:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Formato: PNG con fondo transparente</li>
                <li>Tamaño recomendado: 300 x 120 píxeles</li>
                <li>Peso máximo: 500KB</li>
                <li>El logo debe ser horizontal y legible</li>
              </ul>
            </div>
            
            {uploading && (
              <div className="text-center text-yellow-600">
                <p>Subiendo logo...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Brand Logos Section */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">🏭 Logos de Marcas</CardTitle>
          <CardDescription className="text-green-700">
            Sube los logos de las marcas para que aparezcan en la sección de marcas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brandNames.map(brand => (
              <div key={brand.key} className="border-2 border-dashed border-green-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'brands', brand.key)}
                  className="hidden"
                  id={`upload-brand-${brand.key}`}
                  disabled={uploading}
                />
                <label htmlFor={`upload-brand-${brand.key}`} className="cursor-pointer">
                  <Upload className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <p className="font-medium text-green-800">{brand.name}</p>
                  <p className="text-xs text-green-600">{brand.filename}</p>
                </label>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-xs text-green-700 space-y-1">
            <p><strong>Especificaciones para logos de marcas:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Formato: PNG con fondo transparente (preferido)</li>
              <li>Tamaño recomendado: 120 x 120 píxeles</li>
              <li>Peso máximo: 150KB</li>
              <li>Logo cuadrado y centrado</li>
            </ul>
          </div>
          
          {uploading && (
            <div className="mt-4 text-center text-green-600">
              <p>Subiendo logo de marca...</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Subir Archivos</span>
          </CardTitle>
          <CardDescription>
            Sube imágenes para usar en el blog, promociones y productos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.filter(cat => cat !== 'all').map(category => (
              <div key={category} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#D71920] transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, category)}
                  className="hidden"
                  id={`upload-${category}`}
                  disabled={uploading}
                />
                <label htmlFor={`upload-${category}`} className="cursor-pointer">
                  <FolderOpen className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="font-medium text-gray-900 capitalize">{category}</p>
                  <p className="text-sm text-gray-500">Click para subir</p>
                </label>
              </div>
            ))}
          </div>
          {uploading && (
            <div className="mt-4 text-center">
              <p className="text-[#D71920]">Subiendo archivo...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar archivos..."
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
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Todas las categorías' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredFiles.map(file => (
          <Card key={file.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gray-100 flex items-center justify-center">
              {file.file_type === 'image' ? (
                <img
                  src={file.url}
                  alt={file.alt_text || file.filename}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-xs">
                  {file.category}
                </Badge>
                <div className="flex items-center space-x-1">
                  <Button
                    onClick={() => window.open(file.url, '_blank')}
                    variant="outline"
                    size="sm"
                    className="p-1 h-6 w-6"
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button
                    onClick={() => handleDeleteFile(file.id)}
                    variant="outline"
                    size="sm"
                    className="p-1 h-6 w-6 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <h4 className="font-medium text-sm text-gray-900 truncate">{file.filename}</h4>
              <p className="text-xs text-gray-500 mt-1">{(file.size_bytes / 1024).toFixed(1)} KB</p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {file.description || 'Sin descripción'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <FolderOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay archivos</h3>
            <p className="text-gray-500">
              {files.length === 0 
                ? 'Sube tu primera imagen usando la sección de arriba'
                : 'No se encontraron archivos con los filtros actuales'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-gray-900 mb-2">💡 Instrucciones para subir archivos</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• <strong>Blog:</strong> Imágenes para artículos y posts</li>
            <li>• <strong>Promociones:</strong> Imágenes para ofertas especiales</li>
            <li>• <strong>Productos:</strong> Fotos de productos del catálogo</li>
            <li>• <strong>Servicios:</strong> Imágenes de servicios ofrecidos</li>
            <li>• <strong>General:</strong> Otras imágenes del sitio web</li>
          </ul>
          <p className="text-sm text-gray-500 mt-3">
            Formatos recomendados: JPG, PNG. Tamaño máximo: 2MB por archivo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaManager;