import React from 'react';
import { Phone, MessageCircle, MapPin, Clock, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

const CTASection = () => {
  const contactMethods = [
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      description: 'Respuesta inmediata',
      action: 'Chatear Ahora',
      color: 'from-green-500 to-green-600',
      onClick: () => {
        const message = encodeURIComponent('Hola! Me gustaría obtener información sobre los servicios de Confiautos.');
        window.open(`https://wa.me/50766385935?text=${message}`, '_blank');
      }
    },
    {
      icon: Phone,
      title: 'Llamada Directa',
      description: '6638-5935',
      action: 'Llamar',
      color: 'from-[#D71920] to-[#b01319]',
      onClick: () => window.open('tel:6638-5935', '_self')
    },
    {
      icon: Calendar,
      title: 'Agendar Cita',
      description: 'Reserva tu servicio',
      action: 'Agendar',
      color: 'from-[#004A9F] to-[#003875]',
      onClick: () => window.location.href = '/contacto'
    },
    {
      icon: MapPin,
      title: 'Visítanos',
      description: 'Av. Perú con calle 32 Este',
      action: 'Ver Ubicación',
      color: 'from-gray-700 to-gray-800',
      onClick: () => window.open('https://maps.google.com/?q=Av. Perú con calle 32 Este, Calidonia, Panamá', '_blank')
    }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-64 h-64 border border-white rounded-full"></div>
          <div className="absolute top-40 right-32 w-32 h-32 border border-white rounded-full"></div>
          <div className="absolute bottom-32 left-1/4 w-48 h-48 border border-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-20 h-20 border border-white rounded-full"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main CTA Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 font-helvetica">
            ¿Listo para Comenzar?
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8 font-helvetica">
            Tu vehículo merece el mejor cuidado. Contáctanos hoy y experimenta 
            la diferencia de trabajar con verdaderos profesionales
          </p>
          
          {/* Main CTA Button */}
          <Button
            size="lg"
            onClick={() => {
              const message = encodeURIComponent('¡Hola! Estoy interesado en sus servicios de calidad premium. ¿Podrían ayudarme?');
              window.open(`https://wa.me/50766385935?text=${message}`, '_blank');
            }}
            className="bg-gradient-to-r from-[#D71920] to-[#004A9F] hover:from-[#b01319] hover:to-[#003875] text-white px-12 py-4 text-xl font-bold rounded-2xl transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-3xl font-helvetica"
          >
            Contáctanos Ahora
            <ArrowRight className="ml-3 w-6 h-6" />
          </Button>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactMethods.map((method, index) => {
            const IconComponent = method.icon;
            return (
              <Card
                key={index}
                className="group bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                onClick={method.onClick}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 font-helvetica">
                    {method.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4 font-helvetica">
                    {method.description}
                  </p>
                  <div className="text-white/80 text-sm font-semibold group-hover:text-white transition-colors duration-300 font-helvetica">
                    {method.action} →
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Business Hours & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Clock className="w-8 h-8 text-[#D71920] mr-4" />
                <h3 className="text-2xl font-bold text-white font-helvetica">
                  Horarios de Atención
                </h3>
              </div>
              <div className="space-y-3 text-gray-300 font-helvetica">
                <div className="flex justify-between">
                  <span>Lunes - Viernes:</span>
                  <span className="text-white font-semibold">8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábados:</span>
                  <span className="text-white font-semibold">8:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Domingos:</span>
                  <span className="text-red-400 font-semibold">Cerrado</span>
                </div>
              </div>
              <div className="mt-6 p-4 bg-white/10 rounded-lg">
                <p className="text-yellow-400 text-sm font-helvetica">
                  ⚡ Atención de emergencias disponible por WhatsApp 24/7
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <MapPin className="w-8 h-8 text-[#004A9F] mr-4" />
                <h3 className="text-2xl font-bold text-white font-helvetica">
                  Nuestra Ubicación
                </h3>
              </div>
              <div className="space-y-4 text-gray-300 font-helvetica">
                <p className="text-white font-semibold">
                  Av. Perú con calle 32 Este, a un costado de la Lotería Nacional
                </p>
                <p>Calidonia, Panamá</p>
                <div className="space-y-2">
                  <p><strong>Teléfono:</strong> 6638-5935</p>
                  <p><strong>Email:</strong> info@conficompraspty.com</p>
                  <p><strong>Instagram:</strong> @ConfiautosPanama</p>
                </div>
              </div>
              <Button
                onClick={() => window.open('https://maps.google.com/?q=Av. Perú con calle 32 Este, Calidonia, Panamá', '_blank')}
                className="mt-4 bg-white/20 hover:bg-white/30 text-white border border-white/30 font-helvetica"
              >
                Ver en Google Maps
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Final CTA */}
        <div className="text-center bg-gradient-to-r from-[#D71920]/20 to-[#004A9F]/20 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/20">
          <h3 className="text-3xl md:text-4xl font-bold mb-4 font-helvetica">
            Tu Auto en las Mejores Manos
          </h3>
          <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto font-helvetica">
            Más de 15 años cuidando vehículos en Panamá. Tecnología de punta, 
            personal certificado y la mejor atención al cliente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => window.location.href = '/servicios'}
              className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-300 font-helvetica"
            >
              Ver Servicios
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.location.href = '/productos'}
              className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-300 font-helvetica"
            >
              Ver Productos
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.location.href = '/nosotros'}
              className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-300 font-helvetica"
            >
              Conocer Más
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;