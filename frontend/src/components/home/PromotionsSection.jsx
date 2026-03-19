import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Clock, CheckCircle, Tag, Upload } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { promotions } from '../../data/mockData';
import { useToast } from '../../hooks/use-toast';

const PromotionsSection = () => {
  const { toast } = useToast();
  const [currentPromo, setCurrentPromo] = useState(0);
  const [localImages, setLocalImages] = useState({});

  useEffect(() => {
    // Check for local images uploaded by user
    const checkLocalImages = async () => {
      const imageMap = {};
      const localImageNames = [
        'promo-1-mantenimiento.jpg',
        'promo-2-aire-acondicionado.jpg', 
        'promo-3-completo.jpg'
      ];

      for (let i = 0; i < localImageNames.length; i++) {
        try {
          const response = await fetch(`/images/promotions/${localImageNames[i]}`, { method: 'HEAD' });
          if (response.ok) {
            imageMap[i + 1] = `/images/promotions/${localImageNames[i]}`;
          }
        } catch (error) {
          // Local image not found, use stock image
          console.log(`Local image not found: ${localImageNames[i]}`);
        }
      }
      setLocalImages(imageMap);
    };

    checkLocalImages();

    const interval = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promotions.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getImageUrl = (promo) => {
    // Use local image if available, otherwise use stock image
    return localImages[promo.id] || promo.image;
  };

  const nextPromo = () => {
    setCurrentPromo((prev) => (prev + 1) % promotions.length);
  };

  const prevPromo = () => {
    setCurrentPromo((prev) => (prev - 1 + promotions.length) % promotions.length);
  };

  const handleReservePromo = (promo) => {
    const whatsappNumber = promo.whatsapp || '66385935';
    const message = encodeURIComponent(
      `Hola! Me interesa la promoción: ${promo.title} por $${promo.discountPrice}. ¿Podrían darme más información?`
    );
    window.open(`https://wa.me/507${whatsappNumber}?text=${message}`, '_blank');
    
    toast({
      title: "¡Promoción seleccionada!",
      description: "Te redirigimos a WhatsApp para más información.",
    });
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm bg-[#D71920]/10 text-[#D71920] font-helvetica">
            🔥 OFERTAS ESPECIALES
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-helvetica">
            Promociones Exclusivas
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-helvetica">
            Aprovecha nuestras ofertas especiales y obtén servicios de calidad premium a precios increíbles
          </p>
        </div>

        {/* Promotions Carousel */}
        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden rounded-2xl shadow-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentPromo * 100}%)` }}
            >
              {promotions.map((promo, index) => (
                <div key={promo.id} className="w-full flex-shrink-0">
                  <Card className="border-0 rounded-none bg-gradient-to-r from-white to-gray-50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
                      {/* Content Side */}
                      <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                        <div className="space-y-6">
                          {/* Promo Badge */}
                          <div className="flex items-center space-x-4">
                            <Badge className="bg-[#D71920] text-white px-4 py-2 text-lg font-helvetica">
                              OFERTA ESPECIAL
                            </Badge>
                            <div className="flex items-center text-gray-500 text-sm">
                              <Clock className="w-4 h-4 mr-2" />
                              <span className="font-helvetica">Válida hasta {new Date(promo.validUntil).toLocaleDateString()}</span>
                            </div>
                          </div>

                          {/* Title & Description */}
                          <div>
                            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 font-helvetica">
                              {promo.title}
                            </h3>
                            <p className="text-lg text-gray-600 font-helvetica">
                              {promo.description}
                            </p>
                          </div>

                          {/* Pricing */}
                          <div className="flex items-center space-x-4">
                            <div className="text-3xl font-bold text-[#D71920] font-helvetica">
                              ${promo.discountPrice}
                            </div>
                            <div className="text-xl text-gray-500 line-through font-helvetica">
                              ${promo.originalPrice}
                            </div>
                            <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1 font-helvetica">
                              {Math.round(((promo.originalPrice - promo.discountPrice) / promo.originalPrice) * 100)}% OFF
                            </Badge>
                          </div>

                          {/* Includes */}
                          <div className="space-y-3">
                            <h4 className="text-lg font-semibold text-gray-900 font-helvetica">Esta promoción incluye:</h4>
                            <ul className="space-y-2">
                              {promo.includes.map((item, idx) => (
                                <li key={idx} className="flex items-center text-gray-700">
                                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                  <span className="font-helvetica">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* CTA Buttons */}
                          <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button
                              onClick={() => handleReservePromo(promo)}
                              className="bg-[#D71920] hover:bg-[#b01319] text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-helvetica"
                            >
                              <Tag className="w-5 h-5 mr-2" />
                              Reservar Ahora
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => window.location.href = '/contacto'}
                              className="border-[#004A9F] text-[#004A9F] hover:bg-[#004A9F] hover:text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 font-helvetica"
                            >
                              Más Información
                            </Button>
                          </div>
                        </div>
                      </CardContent>

                      {/* Image Side */}
                      <div className="relative overflow-hidden">
                        <img 
                          src={getImageUrl(promo)} 
                          alt={promo.title}
                          className="w-full h-full object-cover"
                          style={{ minHeight: '500px' }}
                          onError={(e) => {
                            // Fallback to stock image if local image fails
                            e.target.src = promo.image;
                          }}
                        />
                        {/* Upload hint for local images */}
                        {!localImages[promo.id] && (
                          <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm flex items-center">
                            <Upload className="w-4 h-4 mr-1" />
                            Imagen de stock
                          </div>
                        )}
                        {localImages[promo.id] && (
                          <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-lg text-sm flex items-center">
                            ✓ Imagen personalizada
                          </div>
                        )}
                        {/* Overlay with price highlight */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center p-8">
                          <div className="text-center text-white">
                            <div className="text-4xl font-bold mb-2 font-helvetica">
                              ${promo.discountPrice}
                            </div>
                            <div className="text-lg opacity-80 font-helvetica">
                              {promo.originalPrice > promo.discountPrice && (
                                <>En lugar de ${promo.originalPrice}</>
                              )}
                            </div>
                            {promo.badge && (
                              <Badge className="mt-4 bg-[#D71920] text-white font-helvetica">
                                {promo.badge}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* Decorative Elements */}
                        <div className="absolute top-8 left-8 w-16 h-16 bg-white/20 rounded-full animate-pulse"></div>
                        <div className="absolute bottom-8 right-8 w-12 h-12 bg-[#D71920]/30 rounded-full animate-pulse delay-1000"></div>
                        <div className="absolute top-1/2 right-4 w-8 h-8 bg-[#004A9F]/20 rounded-full animate-bounce delay-500"></div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <Button
            onClick={prevPromo}
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Button
            onClick={nextPromo}
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white shadow-lg"
          >
            <ArrowRight className="w-5 h-5" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-3 mt-8">
            {promotions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPromo(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentPromo 
                    ? 'bg-[#D71920] scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6 font-helvetica">
            ¿No ves la promoción que buscas? ¡Contáctanos para ofertas personalizadas!
          </p>
          <Button
            onClick={() => {
              const message = encodeURIComponent('Hola! Me gustaría conocer si tienen promociones especiales o descuentos disponibles.');
              window.open(`https://wa.me/50766385935?text=${message}`, '_blank');
            }}
            variant="outline"
            className="border-[#004A9F] text-[#004A9F] hover:bg-[#004A9F] hover:text-white px-8 py-3 font-helvetica"
          >
            Consultar Ofertas Especiales
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromotionsSection;