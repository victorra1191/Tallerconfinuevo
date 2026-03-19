import React, { useState, useEffect } from 'react';
import { Car, Search, Eye, Edit, Plus, Wrench } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useToast } from '../../hooks/use-toast';

const ServicesSection = () => {
  const { toast } = useToast();
  const [services, setServices] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [servicesRes, requestsRes] = await Promise.all([
        fetch('/api/services/'),  // Added trailing slash
        fetch('/api/admin/service-requests', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
        })
      ]);

      if (servicesRes.ok) {
        const servicesData = await servicesRes.json();
        console.log('Services loaded:', servicesData);
        setServices(servicesData || []);  // Direct array, not nested
      } else {
        console.error('Services response not OK:', servicesRes.status);
      }

      if (requestsRes.ok) {
        const requestsData = await requestsRes.json();
        console.log('Service requests loaded:', requestsData);
        setServiceRequests(requestsData.service_requests || []);
      } else {
        console.error('Service requests response not OK:', requestsRes.status);
      }

    } catch (error) {
      console.error('Load data error:', error);
      toast({
        title: "Error",
        description: "Error cargando datos de servicios",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getServiceStats = (serviceId) => {
    const requests = serviceRequests.filter(req => req.service_id === serviceId);
    return {
      total_requests: requests.length,
      recent_requests: requests.filter(req => {
        const reqDate = new Date(req.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return reqDate > weekAgo;
      }).length
    };
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Servicios</h2>
          <p className="text-gray-600">Administra los servicios ofrecidos por tu taller</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Wrench className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Servicios</p>
                <p className="text-2xl font-bold text-gray-900">{services.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Solicitudes Totales</p>
                <p className="text-2xl font-bold text-gray-900">{serviceRequests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Plus className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Esta Semana</p>
                <p className="text-2xl font-bold text-gray-900">
                  {serviceRequests.filter(req => {
                    const reqDate = new Date(req.created_at);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return reqDate > weekAgo;
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar servicios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services List */}
      <div className="grid gap-6">
        {filteredServices.map(service => {
          const stats = getServiceStats(service.id);
          return (
            <Card key={service.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#D71920] to-[#004A9F] rounded-full flex items-center justify-center">
                        <Wrench className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                        <p className="text-gray-600">{service.description}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Incluye:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {service.includes.slice(0, 5).map((item, index) => (
                            <li key={index} className="flex items-center">
                              <span className="w-2 h-2 bg-[#D71920] rounded-full mr-2"></span>
                              {item}
                            </li>
                          ))}
                          {service.includes.length > 5 && (
                            <li className="text-gray-500 italic">
                              +{service.includes.length - 5} elementos más...
                            </li>
                          )}
                        </ul>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <span className="text-sm font-medium text-blue-800">Duración</span>
                          <span className="text-sm text-blue-600">{service.duration}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <span className="text-sm font-medium text-green-800">Total Solicitudes</span>
                          <span className="text-lg font-bold text-green-600">{stats.total_requests}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                          <span className="text-sm font-medium text-purple-800">Esta Semana</span>
                          <span className="text-lg font-bold text-purple-600">{stats.recent_requests}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          {service.category || 'Servicio General'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      onClick={() => {
                        toast({
                          title: "Información",
                          description: `Servicio: ${service.name}\nSolicitudes: ${stats.total_requests}`,
                        });
                      }}
                      variant="outline"
                      size="sm"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredServices.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Wrench className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron servicios</h3>
            <p className="text-gray-500">
              {services.length === 0 
                ? 'Aún no hay servicios registrados en el sistema'
                : 'Intenta ajustar tu búsqueda'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Recent Service Requests */}
      {serviceRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Solicitudes Recientes</CardTitle>
            <CardDescription>
              Últimas solicitudes de servicios recibidas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serviceRequests.slice(0, 5).map(request => {
                const service = services.find(s => s.id === request.service_id);
                return (
                  <div key={request.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{request.customer_name}</p>
                      <p className="text-sm text-gray-600">{service?.name || 'Servicio desconocido'}</p>
                      <p className="text-xs text-gray-500">{request.customer_phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {new Date(request.created_at).toLocaleDateString('es-ES')}
                      </p>
                      <Button
                        onClick={() => {
                          const message = encodeURIComponent(`Hola ${request.customer_name}, recibimos su solicitud de ${service?.name}. Nos pondremos en contacto pronto.`);
                          window.open(`https://wa.me/507${request.customer_phone}?text=${message}`, '_blank');
                        }}
                        variant="outline"
                        size="sm"
                        className="mt-1"
                      >
                        Contactar
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ServicesSection;