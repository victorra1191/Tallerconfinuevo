import React, { useState } from 'react';
import { X, Calendar, User, Car, MessageCircle, Send, Clock, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';
import { mockFunctions } from '../data/mockData';

const ServiceRequestModal = ({ isOpen, onClose, service }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleYear: '',
    urgency: '',
    preferredDate: '',
    preferredTime: '',
    description: '',
    contactMethod: 'whatsapp'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const vehicleBrands = [
    'Toyota', 'Honda', 'Hyundai', 'Kia', 'Nissan', 'Mazda', 'Ford', 
    'Chevrolet', 'Volkswagen', 'BMW', 'Mercedes-Benz', 'Audi', 'Mitsubishi', 'Otro'
  ];

  const urgencyLevels = [
    { value: 'baja', label: 'Baja - Cuando tengas disponibilidad', color: 'bg-green-100 text-green-800' },
    { value: 'media', label: 'Media - Esta semana', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'alta', label: 'Alta - En 2-3 días', color: 'bg-orange-100 text-orange-800' },
    { value: 'urgente', label: 'Urgente - Hoy mismo', color: 'bg-red-100 text-red-800' }
  ];

  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const requestData = {
        ...formData,
        serviceName: service.name,
        serviceId: service.id,
        timestamp: new Date().toISOString()
      };

      const result = await mockFunctions.requestServiceQuote(requestData);
      
      if (result.success) {
        toast({
          title: "¡Solicitud enviada!",
          description: result.message,
        });

        // Redirect to WhatsApp with pre-filled message
        const message = encodeURIComponent(
          `¡Hola! Solicito información sobre el servicio: *${service.name}*\n\n` +
          `👤 Nombre: ${formData.name}\n` +
          `📱 Teléfono: ${formData.phone}\n` +
          `🚗 Vehículo: ${formData.vehicleBrand} ${formData.vehicleModel} ${formData.vehicleYear}\n` +
          `⚡ Urgencia: ${urgencyLevels.find(u => u.value === formData.urgency)?.label || 'No especificada'}\n` +
          `📅 Fecha preferida: ${formData.preferredDate || 'Flexible'}\n` +
          `🕐 Hora preferida: ${formData.preferredTime || 'Flexible'}\n\n` +
          `📝 Detalles adicionales: ${formData.description || 'Ninguno'}\n\n` +
          `¡Gracias por confiar en Confiautos! 🔧✨`
        );
        
        window.open(`https://wa.me/50766385935?text=${message}`, '_blank');
        
        onClose();
        // Reset form
        setFormData({
          name: '', phone: '', email: '', vehicleBrand: '', vehicleModel: '', 
          vehicleYear: '', urgency: '', preferredDate: '', preferredTime: '', 
          description: '', contactMethod: 'whatsapp'
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al enviar la solicitud. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#D71920] to-[#004A9F] text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-helvetica">Solicitar Servicio</h2>
                <p className="text-white/90 font-helvetica">{service.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Service Info */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {service.badge && (
                <Badge className="bg-[#D71920] text-white font-helvetica">
                  {service.badge}
                </Badge>
              )}
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                <span className="font-helvetica">{service.duration}</span>
              </div>
            </div>
            <div className="flex items-center text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
          </div>
          <p className="text-gray-600 mb-4 font-helvetica">{service.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {service.includes.slice(0, 4).map((item, index) => (
              <div key={index} className="flex items-center text-sm text-gray-700">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="font-helvetica">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 font-helvetica flex items-center">
              <User className="w-5 h-5 mr-2 text-[#D71920]" />
              Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block font-helvetica">
                  Nombre Completo *
                </label>
                <Input
                  placeholder="Tu nombre completo"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="font-helvetica"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block font-helvetica">
                  Teléfono *
                </label>
                <Input
                  placeholder="6xxx-xxxx"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                  className="font-helvetica"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block font-helvetica">
                Email (opcional)
              </label>
              <Input
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="font-helvetica"
              />
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 font-helvetica flex items-center">
              <Car className="w-5 h-5 mr-2 text-[#004A9F]" />
              Información del Vehículo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block font-helvetica">
                  Marca *
                </label>
                <Select
                  value={formData.vehicleBrand}
                  onValueChange={(value) => setFormData({...formData, vehicleBrand: value})}
                  required
                >
                  <SelectTrigger className="font-helvetica">
                    <SelectValue placeholder="Seleccionar marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleBrands.map(brand => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block font-helvetica">
                  Modelo *
                </label>
                <Input
                  placeholder="ej. Corolla"
                  value={formData.vehicleModel}
                  onChange={(e) => setFormData({...formData, vehicleModel: e.target.value})}
                  required
                  className="font-helvetica"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block font-helvetica">
                  Año *
                </label>
                <Input
                  placeholder="ej. 2020"
                  value={formData.vehicleYear}
                  onChange={(e) => setFormData({...formData, vehicleYear: e.target.value})}
                  required
                  className="font-helvetica"
                />
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 font-helvetica flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-green-600" />
              Detalles del Servicio
            </h3>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block font-helvetica">
                Nivel de Urgencia *
              </label>
              <Select
                value={formData.urgency}
                onValueChange={(value) => setFormData({...formData, urgency: value})}
                required
              >
                <SelectTrigger className="font-helvetica">
                  <SelectValue placeholder="¿Qué tan urgente es?" />
                </SelectTrigger>
                <SelectContent>
                  {urgencyLevels.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      <div className="flex items-center space-x-2">
                        <div className={`px-2 py-1 rounded text-xs ${level.color}`}>
                          {level.value.toUpperCase()}
                        </div>
                        <span>{level.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block font-helvetica">
                  Fecha Preferida
                </label>
                <Input
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  className="font-helvetica"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block font-helvetica">
                  Hora Preferida
                </label>
                <Select
                  value={formData.preferredTime}
                  onValueChange={(value) => setFormData({...formData, preferredTime: value})}
                >
                  <SelectTrigger className="font-helvetica">
                    <SelectValue placeholder="Seleccionar hora" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block font-helvetica">
                Describe el problema o necesidad
              </label>
              <Textarea
                placeholder="Cuéntanos más detalles sobre lo que necesitas..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="font-helvetica"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 font-helvetica"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-[#D71920] to-[#004A9F] hover:from-[#b01319] hover:to-[#003875] text-white font-helvetica"
            >
              {isSubmitting ? (
                'Enviando...'
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Enviar Solicitud
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceRequestModal;