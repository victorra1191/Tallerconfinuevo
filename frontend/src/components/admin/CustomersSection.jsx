import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Calendar, Phone, Mail, Car } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useToast } from '../../hooks/use-toast';

const CustomersSection = () => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const headers = { 'Authorization': `Bearer ${token}` };

      // Load detailed customer data
      const customerRes = await fetch('/api/admin/customers/detailed', { headers });

      if (customerRes.ok) {
        const customerData = await customerRes.json();
        console.log('Customer data loaded:', customerData);
        
        // Convert customers to the expected format
        const formattedCustomers = customerData.customers.map(customer => ({
          phone: customer.phone || customer.id.slice(0, 8),
          name: customer.name,
          email: customer.email,
          source: customer.source,
          last_contact: customer.last_contact,
          services: customer.services,
          quotes: customer.quotes,
          appointments: customer.appointments
        }));
        
        setCustomers(formattedCustomers);
        setServiceRequests(Array(customerData.total_service_requests).fill({}));
        setQuotes(Array(customerData.total_quotes).fill({}));
        setAppointments(Array(customerData.total_appointments).fill({}));
      }

    } catch (error) {
      console.error('Load data error:', error);
      toast({
        title: "Error",
        description: "Error cargando datos de clientes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Get all customers - now using the loaded customers directly
  const getAllCustomers = () => {
    return customers;
  };

  const allCustomers = getAllCustomers();

  const filteredCustomers = allCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportData = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/export/customers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `confiautos-clientes-${new Date().toISOString().slice(0, 10)}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: "Éxito",
          description: "Datos exportados correctamente",
        });
      } else {
        throw new Error('Error exportando datos');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h2>
          <p className="text-gray-600">Administra la información de tus clientes</p>
        </div>
        <Button
          onClick={() => handleExportData()}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          📊 Exportar Datos
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Clientes</p>
                <p className="text-2xl font-bold text-gray-900">{allCustomers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Solicitudes</p>
                <p className="text-2xl font-bold text-gray-900">{serviceRequests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Citas</p>
                <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Phone className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cotizaciones</p>
                <p className="text-2xl font-bold text-gray-900">{quotes.length}</p>
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
                  placeholder="Buscar clientes por nombre, teléfono o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers List */}
      <div className="grid gap-6">
        {filteredCustomers.map(customer => (
          <Card key={customer.phone} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#D71920] to-[#004A9F] rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                      <p className="text-gray-600 flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {customer.phone}
                      </p>
                      {customer.email && (
                        <p className="text-gray-600 flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {customer.email}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{customer.services}</p>
                      <p className="text-sm text-blue-800">Servicios</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{customer.quotes}</p>
                      <p className="text-sm text-green-800">Cotizaciones</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{customer.appointments}</p>
                      <p className="text-sm text-purple-800">Citas</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Último contacto: {formatDate(customer.last_contact)}</span>
                    </div>
                    <Badge variant="outline">
                      {customer.source === 'service_request' && 'Servicio'}
                      {customer.source === 'quote' && 'Cotización'}
                      {customer.source === 'appointment' && 'Cita'}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    onClick={() => {
                      const message = encodeURIComponent(`Hola ${customer.name}, nos comunicamos de Confiautos Panama.`);
                      window.open(`https://wa.me/507${customer.phone}?text=${message}`, '_blank');
                    }}
                    variant="outline"
                    size="sm"
                    className="text-green-600 hover:text-green-700"
                  >
                    WhatsApp
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron clientes</h3>
            <p className="text-gray-500">
              {allCustomers.length === 0 
                ? 'Aún no hay clientes registrados en el sistema'
                : 'Intenta ajustar tu búsqueda'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomersSection;