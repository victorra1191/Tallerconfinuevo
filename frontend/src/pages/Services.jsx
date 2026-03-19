import React, { useState } from 'react';
import { Clock, CheckCircle, Star, ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { services } from '../data/mockData';
import { useToast } from '../hooks/use-toast';
import ServiceRequestModal from '../components/ServiceRequestModal';

const Services = () => {
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRequestService = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#D71920] to-[#004A9F] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-helvetica">
              Nuestros Servicios
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 font-helvetica">
              Servicios especializados con tecnología de punta y garantía de calidad
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="px-4 py-2 text-lg bg-white/20 text-white hover:bg-white/30">
                ✓ Equipos de última generación
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-lg bg-white/20 text-white hover:bg-white/30">
                ✓ Personal certificado
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-lg bg-white/20 text-white hover:bg-white/30">
                ✓ Garantía de calidad
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={service.id}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <CardHeader className="relative overflow-hidden">
                <div className="w-full h-48 rounded-lg mb-4 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src={service.image} 
                    alt={service.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=500&h=300&fit=crop';
                    }}
                  />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-[#D71920] transition-colors duration-300 font-helvetica">
                  {service.name}
                </CardTitle>
                <CardDescription className="text-gray-600 font-helvetica">
                  {service.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Service Details without price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {service.badge && (
                      <Badge className="bg-[#D71920] text-white font-helvetica">
                        {service.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="font-helvetica">{service.duration}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold text-gray-900 font-helvetica">Incluye:</p>
                  <ul className="space-y-1">
                    {service.includes.map((item, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="font-helvetica">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button
                    onClick={() => handleRequestService(service)}
                    className="flex-1 bg-[#D71920] hover:bg-[#b01319] text-white font-helvetica"
                  >
                    Agendar Cita
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const message = encodeURIComponent(`Hola! Me interesa el servicio de ${service.name}. ¿Podrían darme más información?`);
                      window.open(`https://wa.me/50766385935?text=${message}`, '_blank');
                    }}
                    className="px-4 border-[#004A9F] text-[#004A9F] hover:bg-[#004A9F] hover:text-white font-helvetica"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Additional Services */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-helvetica">
              Servicios Adicionales
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-helvetica">
              También ofrecemos servicios especializados para necesidades específicas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'Reparación de Frenos',
              'Suspensión y Dirección',
              'Revisión Pre-Venta',
              'Instalación de Accesorios',
              'Detailing y Lavado',
              'Alineación y Balanceo',
              'Escaneo Vehicular',
              'Mantenimiento Preventivo'
            ].map((service, index) => (
              <div
                key={index}
                className="text-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300 cursor-pointer"
                onClick={() => {
                  const message = encodeURIComponent(`Hola! Me interesa el servicio de ${service}. ¿Podrían darme más información?`);
                  window.open(`https://wa.me/50766385935?text=${message}`, '_blank');
                }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#D71920] to-[#004A9F] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 font-helvetica">{service}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-helvetica">
            ¿Necesitas una cotización personalizada?
          </h2>
          <p className="text-xl mb-8 text-gray-300 font-helvetica">
            Contáctanos y te ayudaremos a encontrar la solución perfecta para tu vehículo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-[#D71920] hover:bg-[#b01319] text-white px-8 py-3 font-helvetica"
              onClick={() => window.location.href = '/contacto'}
            >
              Solicitar Cotización
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 font-helvetica"
              onClick={() => {
                const message = encodeURIComponent('Hola! Me gustaría recibir una cotización personalizada para mi vehículo.');
                window.open(`https://wa.me/50766385935?text=${message}`, '_blank');
              }}
            >
              WhatsApp
            </Button>
          </div>
        </div>
      </div>

      <ServiceRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={selectedService}
      />
    </div>
  );
};

export default Services;