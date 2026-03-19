import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useToast } from '../../hooks/use-toast';

const ServicesCRUD = () => {
  const { toast } = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    includes: [],
    specialty: false,
    badge: '',
    category: ''
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/services', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error cargando servicios",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('admin_token');
      const url = editingService 
        ? `/api/admin/services/${editingService.id}`
        : '/api/admin/services';
      
      const method = editingService ? 'PUT' : 'POST';
      const body = editingService ? formData : {
        ...formData,
        id: Date.now().toString(),
        includes: formData.includes.split('\n').map(i => i.trim()).filter(i => i),
        specialty: formData.specialty === true || formData.specialty === 'true'
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        toast({
          title: "Éxito",
          description: editingService ? "Servicio actualizado" : "Servicio creado",
        });
        
        resetForm();
        loadServices();
      } else {
        throw new Error('Error en la operación');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error guardando servicio",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      ...service,
      includes: service.includes ? service.includes.join('\n') : ''
    });
    setShowForm(true);
  };

  const handleDelete = async (serviceId) => {
    if (!confirm('¿Estás seguro de eliminar este servicio?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Servicio eliminado",
        });
        loadServices();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error eliminando servicio",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      duration: '',
      includes: [],
      specialty: false,
      badge: '',
      category: ''
    });
    setEditingService(null);
    setShowForm(false);
  };

  if (loading && services.length === 0) {
    return <div className="text-center py-8">Cargando servicios...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Servicios</h2>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-[#D71920] hover:bg-[#b01319]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Servicio
        </Button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <Card className="border-2 border-[#D71920]">
          <CardHeader>
            <CardTitle>
              {editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
            </CardTitle>
            <CardDescription>
              Completa los datos del servicio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nombre</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Duración</label>
                  <Input
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    placeholder="2-4 horas"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Categoría</label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    placeholder="Mantenimiento, Mecánica, etc."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Badge (opcional)</label>
                  <Input
                    value={formData.badge}
                    onChange={(e) => setFormData({...formData, badge: e.target.value})}
                    placeholder="ESPECIALIDAD, PREMIUM, etc."
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Descripción</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Lo que incluye (uno por línea)
                </label>
                <Textarea
                  value={formData.includes}
                  onChange={(e) => setFormData({...formData, includes: e.target.value})}
                  placeholder="Diagnóstico completo&#10;Cambio de piezas&#10;Garantía de trabajo"
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="specialty"
                  checked={formData.specialty}
                  onChange={(e) => setFormData({...formData, specialty: e.target.checked})}
                  className="w-4 h-4"
                />
                <label htmlFor="specialty" className="text-sm font-medium">
                  Servicio especializado
                </label>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {editingService ? 'Actualizar' : 'Crear'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <CardDescription>{service.category}</CardDescription>
                </div>
                <div className="flex flex-col space-y-1">
                  <Badge variant="secondary">{service.duration}</Badge>
                  {service.badge && (
                    <Badge className="bg-[#D71920] text-white">{service.badge}</Badge>
                  )}
                  {service.specialty && (
                    <Badge variant="outline">Especialidad</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">{service.description}</p>
                
                {service.includes && service.includes.length > 0 && (
                  <div>
                    <strong>Incluye:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {service.includes.slice(0, 3).map((item, index) => (
                        <li key={index} className="text-gray-600">{item}</li>
                      ))}
                      {service.includes.length > 3 && (
                        <li className="text-gray-500">... y {service.includes.length - 3} más</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(service)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(service.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServicesCRUD;