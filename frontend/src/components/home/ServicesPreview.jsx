import React from 'react';
import { ArrowRight, Zap, Shield, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { services } from '../../data/mockData';

const ServicesPreview = ({ onServiceRequest }) => {
  // Show top 6 services for preview
  const previewServices = services.slice(0, 6);

  const handleServiceInquiry = (service) => {
    if (onServiceRequest) {
      onServiceRequest(service);
    } else {
      // Fallback to WhatsApp if no modal handler
      const message = encodeURIComponent(`Hola! Me interesa el servicio de ${service.name}. ¿Podrían darme más información?`);
      window.open(`https://wa.me/50766385935?text=${message}`, '_blank');
    }
  };

  return (
    <div className="bg-white py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm bg-[#004A9F]/10 text-[#004A9F] font-helvetica">
            ⚡ SERVICIOS ESPECIALIZADOS
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-helvetica">
            Servicios de Excelencia
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-helvetica">
            Desde diagnóstico computarizado hasta reparaciones complejas, ofrecemos servicios completos con la mejor tecnología
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {previewServices.map((service, index) => (
            <Card
              key={service.id}
              className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* Service Icon/Image */}
              <CardHeader className="relative p-6">
                <div className="w-full h-40 bg-gradient-to-br from-[#D71920]/10 to-[#004A9F]/10 rounded-xl mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 relative overflow-hidden">
                  {service.image ? (
                    <img 
                      src={service.image} 
                      alt={service.name}
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="text-5xl flex items-center justify-center w-full h-full" style={{display: service.image ? 'none' : 'flex'}}>
                    {service.name.includes('Aire') && '❄️'}
                    {service.name.includes('Chapist') && '🎨'}
                    {service.name.includes('Mecánica') && '🔧'}
                    {service.name.includes('Aceite') && '🛢️'}
                    {service.name.includes('Diagnóstico') && '💻'}
                    {service.name.includes('Papel') && '🚗'}
                    {service.name.includes('Frenos') && '🛑'}
                    {service.name.includes('Suspensión') && '🚙'}
                  </div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D71920]/20 to-[#004A9F]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-[#D71920] transition-colors duration-300 font-helvetica">
                  {service.name}
                </CardTitle>
                <CardDescription className="text-gray-600 font-helvetica">
                  {service.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="px-6 pb-6 space-y-4">
                {/* Service Details */}
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-[#D71920] font-helvetica">
                    {service.price}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="font-helvetica">{service.duration}</span>
                  </div>
                </div>

                {/* Key Features */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    <Shield className="w-3 h-3 mr-1" />
                    Garantía
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                    <Zap className="w-3 h-3 mr-1" />
                    Rápido
                  </Badge>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button
                    onClick={() => handleServiceInquiry(service)}
                    className="flex-1 bg-[#D71920] hover:bg-[#b01319] text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-helvetica"
                  >
                    Solicitar
                  </Button>
                  <Button
                    onClick={() => window.location.href = '/servicios'}
                    variant="outline"
                    className="px-4 border-[#004A9F] text-[#004A9F] hover:bg-[#004A9F] hover:text-white transition-all duration-300"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Services Highlight */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-white text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 font-helvetica">
            Y muchos servicios más...
          </h3>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto font-helvetica">
            Reparación de frenos, suspensión, alineación, balanceo, instalación de accesorios, 
            detailing profesional y todo lo que tu vehículo necesite
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => window.location.href = '/servicios'}
              className="bg-[#D71920] hover:bg-[#b01319] text-white px-8 py-3 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-helvetica"
            >
              Ver Todos los Servicios
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                const message = encodeURIComponent('Hola! Me gustaría conocer todos los servicios que ofrecen y recibir una cotización personalizada.');
                window.open(`https://wa.me/50766385935?text=${message}`, '_blank');
              }}
              className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 transition-all duration-300 font-helvetica"
            >
              Cotización Personalizada
            </Button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <div className="w-16 h-16 bg-gradient-to-br from-[#D71920] to-[#004A9F] rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2 font-helvetica">Garantía Total</h4>
            <p className="text-gray-600 font-helvetica">Todos nuestros servicios incluyen garantía de calidad y satisfacción</p>
          </div>
          
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <div className="w-16 h-16 bg-gradient-to-br from-[#004A9F] to-[#D71920] rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2 font-helvetica">Servicio Rápido</h4>
            <p className="text-gray-600 font-helvetica">Atención inmediata y tiempos de respuesta optimizados</p>
          </div>
          
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <div className="w-16 h-16 bg-gradient-to-br from-[#D71920] to-[#004A9F] rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2 font-helvetica">Horarios Flexibles</h4>
            <p className="text-gray-600 font-helvetica">Nos adaptamos a tu horario para mayor comodidad</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPreview;