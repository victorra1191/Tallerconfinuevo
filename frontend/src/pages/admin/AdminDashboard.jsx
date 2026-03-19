import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, FileText, Calendar, MessageCircle, 
  TrendingUp, Eye, Edit, Trash2, Plus, Upload, Settings,
  LogOut, Home, Car, Package, Bell, DollarSign
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../hooks/use-toast';
import BlogManager from '../../components/admin/BlogManager';
import MediaManager from '../../components/admin/MediaManager';
import CustomersSection from '../../components/admin/CustomersSection';
import ServicesSection from '../../components/admin/ServicesSection';
import ProductsSection from '../../components/admin/ProductsSection';
import SettingsSection from '../../components/admin/SettingsSection';
import ProductsCRUD from '../../components/admin/ProductsCRUD';
import ServicesCRUD from '../../components/admin/ServicesCRUD';

const AdminDashboard = () => {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('admin_token');
    const userData = localStorage.getItem('admin_user');
    
    if (!token || !userData) {
      window.location.href = '/admin/login';
      return;
    }

    setUser(JSON.parse(userData));
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        throw new Error('Error cargando datos');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error cargando datos del dashboard",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = '/admin/login';
  };

  const StatCard = ({ title, value, icon: Icon, color = "blue", change = null }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 text-${color}-600`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {change && (
          <p className="text-xs text-gray-500 mt-1">
            <span className={`font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}%
            </span>
            {' '}desde el mes pasado
          </p>
        )}
      </CardContent>
    </Card>
  );

  const ActivityItem = ({ activity, index }) => {
    const getIcon = (type) => {
      switch (type) {
        case 'service_request': return <Car className="w-4 h-4 text-blue-600" />;
        case 'quote': return <DollarSign className="w-4 h-4 text-green-600" />;
        case 'appointment': return <Calendar className="w-4 h-4 text-purple-600" />;
        default: return <Bell className="w-4 h-4 text-gray-600" />;
      }
    };

    return (
      <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
        <div className="flex-shrink-0">
          {getIcon(activity.type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">
            {activity.description}
          </p>
          <p className="text-sm text-gray-500">
            {new Date(activity.date).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#D71920] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[#D71920] to-[#004A9F] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Panel Administrativo</h1>
                  <p className="text-sm text-gray-500">Confiautos Panama</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Salir</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'blog', label: 'Blog', icon: FileText },
              { id: 'customers', label: 'Clientes', icon: Users },
              { id: 'services', label: 'Servicios', icon: Car },
              { id: 'services-crud', label: 'Editar Servicios', icon: Car },
              { id: 'products', label: 'Productos', icon: Package },
              { id: 'products-crud', label: 'Editar Productos', icon: Package },
              { id: 'media', label: 'Media', icon: Upload },
              { id: 'settings', label: 'Configuración', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-[#D71920] text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && analytics && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Clientes"
                value={analytics.total_customers}
                icon={Users}
                color="blue"
                change={12}
              />
              <StatCard
                title="Solicitudes de Servicio"
                value={analytics.total_service_requests}
                icon={Car}
                color="green"
                change={8}
              />
              <StatCard
                title="Cotizaciones"
                value={analytics.total_quotes}
                icon={DollarSign}
                color="yellow"
                change={-3}
              />
              <StatCard
                title="Posts del Blog"
                value={analytics.total_blog_posts}
                icon={FileText}
                color="purple"
                change={5}
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="w-5 h-5" />
                    <span>Actividad Reciente</span>
                  </CardTitle>
                  <CardDescription>
                    Últimas acciones en el sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {analytics.recent_activity && analytics.recent_activity.length > 0 ? (
                      analytics.recent_activity.slice(0, 8).map((activity, index) => (
                        <ActivityItem key={index} activity={activity} index={index} />
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm py-4">No hay actividad reciente</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Popular Services */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Servicios Populares</span>
                  </CardTitle>
                  <CardDescription>
                    Servicios más solicitados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.popular_services && analytics.popular_services.length > 0 ? (
                      analytics.popular_services.map((service, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{service.service_name}</p>
                            <p className="text-sm text-gray-500">{service.request_count} solicitudes</p>
                          </div>
                          <Badge variant="secondary">
                            #{index + 1}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm py-4">No hay datos de servicios</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
                <CardDescription>
                  Tareas comunes del administrador
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => setActiveTab('blog')}
                    className="flex items-center space-x-2 h-20 bg-gradient-to-r from-[#D71920] to-[#b01319]"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Crear Post del Blog</span>
                  </Button>
                  <Button
                    onClick={() => setActiveTab('media')}
                    variant="outline"
                    className="flex items-center space-x-2 h-20 border-[#004A9F] text-[#004A9F] hover:bg-[#004A9F] hover:text-white"
                  >
                    <Upload className="w-5 h-5" />
                    <span>Subir Imágenes</span>
                  </Button>
                  <Button
                    onClick={() => window.open('/', '_blank')}
                    variant="outline"
                    className="flex items-center space-x-2 h-20"
                  >
                    <Home className="w-5 h-5" />
                    <span>Ver Sitio Web</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Other tabs content */}
        {activeTab === 'blog' && <BlogManager />}
        
        {activeTab === 'media' && <MediaManager />}
        
        {activeTab === 'customers' && <CustomersSection />}
        
        {activeTab === 'services' && <ServicesSection />}
        
        {activeTab === 'services-crud' && <ServicesCRUD />}
        
        {activeTab === 'products' && <ProductsSection />}
        
        {activeTab === 'products-crud' && <ProductsCRUD />}
        
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <SettingsSection />
            
            {/* Zoho Calendar Integration */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4">📅 Integración Zoho Calendar</h3>
              <p className="text-blue-700 mb-4">
                Conecta tu calendario de Zoho para que las citas se creen automáticamente.
              </p>
              
              <button
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('admin_token');
                    const response = await fetch('/api/admin/zoho/auth-url', {
                      headers: { 'Authorization': `Bearer ${token}` }
                    });
                    
                    if (response.ok) {
                      const data = await response.json();
                      window.open(data.auth_url, '_blank');
                    }
                  } catch (error) {
                    console.error('Error getting auth URL:', error);
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                🔗 Autorizar Zoho Calendar
              </button>
              
              <div className="mt-4 text-sm text-blue-600">
                <p><strong>¿Cómo funciona?</strong></p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Click en "Autorizar Zoho Calendar"</li>
                  <li>Autoriza la aplicación en Zoho</li>
                  <li>¡Las citas futuras se crearán automáticamente!</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;