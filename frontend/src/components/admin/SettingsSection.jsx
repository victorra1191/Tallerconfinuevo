import React, { useState, useEffect } from 'react';
import { Settings, Save, Upload, Eye, Globe, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useToast } from '../../hooks/use-toast';

const SettingsSection = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('admin_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleCreateNewAdmin = async () => {
    const username = prompt('Ingresa el nombre de usuario para el nuevo admin:');
    if (!username) return;

    const email = prompt('Ingresa el email del nuevo admin:');
    if (!email) return;

    const password = prompt('Ingresa la contraseña para el nuevo admin:');
    if (!password) return;

    const fullName = prompt('Ingresa el nombre completo del nuevo admin:');
    if (!fullName) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/create-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username,
          email,
          password,
          full_name: fullName,
          role: 'admin'
        })
      });

      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Nuevo administrador creado exitosamente",
        });
      } else {
        const error = await response.json();
        throw new Error(error.detail || 'Error creando administrador');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = '/admin/login';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Configuraciones</h2>
          <p className="text-gray-600">Configuraciones del sistema y cuenta de usuario</p>
        </div>
      </div>

      {/* User Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Información de Usuario</span>
          </CardTitle>
          <CardDescription>
            Información de tu cuenta de administrador
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo
                </label>
                <Input
                  value={user.full_name}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  value={user.email}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usuario
                </label>
                <Input
                  value={user.username}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rol
                </label>
                <div className="pt-2">
                  <Badge className="bg-[#D71920] text-white">
                    {user.role}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>Configuraciones del Sitio Web</span>
          </CardTitle>
          <CardDescription>
            Configuraciones generales del sitio web
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Sitio
              </label>
              <Input
                defaultValue="Confiautos Panama"
                disabled
                className="bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <Input
                defaultValue="Confianza y Garantía en servicios automotrices"
                disabled
                className="bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Teléfono Principal
              </label>
              <Input
                defaultValue="66385935"
                disabled
                className="bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email de Contacto
              </label>
              <Input
                defaultValue="info@confiautos.com"
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones de Administrador</CardTitle>
          <CardDescription>
            Acciones avanzadas del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={handleCreateNewAdmin}
              className="bg-[#004A9F] hover:bg-[#003875] text-white h-20 flex flex-col items-center justify-center space-y-2"
            >
              <Settings className="w-6 h-6" />
              <span>Crear Admin</span>
            </Button>
            <Button
              onClick={() => window.open('/', '_blank')}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <Eye className="w-6 h-6" />
              <span>Ver Sitio Web</span>
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
            >
              <Settings className="w-6 h-6" />
              <span>Cerrar Sesión</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* File Management Instructions */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">📁 Gestión de Archivos</CardTitle>
          <CardDescription className="text-green-700">
            Instrucciones para personalizar imágenes del sitio web
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-green-800">
            <div>
              <h4 className="font-semibold mb-2">🖼️ Para subir imágenes:</h4>
              <ul className="space-y-1 ml-4">
                <li>• <strong>Blog:</strong> Usa la sección "Media" → Blog</li>
                <li>• <strong>Promociones:</strong> Sube archivos con nombres específicos en la carpeta promotions/</li>
                <li>• <strong>Logo:</strong> Guarda como "logo-confiautos.png" en /images/</li>
                <li>• <strong>Productos:</strong> Usa formato "producto-[SKU].jpg"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">📐 Tamaños recomendados:</h4>
              <ul className="space-y-1 ml-4">
                <li>• <strong>Logo:</strong> 300x120 píxeles</li>
                <li>• <strong>Promociones:</strong> 800x500 píxeles</li>
                <li>• <strong>Productos:</strong> 400x400 píxeles</li>
                <li>• <strong>Blog:</strong> 600x400 píxeles mínimo</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Status */}
      <Card>
        <CardHeader>
          <CardTitle>Estado del Sistema</CardTitle>
          <CardDescription>
            Estado actual de las integraciones y servicios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm font-medium">Base de Datos</span>
              <Badge className="bg-green-100 text-green-800">Conectada</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm font-medium">API Backend</span>
              <Badge className="bg-green-100 text-green-800">Funcionando</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm font-medium">WhatsApp Integration</span>
              <Badge className="bg-green-100 text-green-800">Configurada</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm font-medium">Blog System</span>
              <Badge className="bg-green-100 text-green-800">Activo</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsSection;