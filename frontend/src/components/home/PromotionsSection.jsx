import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Clock, CheckCircle, Tag } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { promotions } from '../../data/mockData';
import { useToast } from '../../hooks/use-toast';

const PromotionsSection = () => {
  const { toast } = useToast();
  const [currentPromo, setCurrentPromo] = useState(0);
  const [localImages, setLocalImages] = useState({});

  useEffect(() => {
    // Certeza técnica: Verificamos imágenes sin disparar errores 404 en la consola
    const checkLocalImages = () => {
      const localImageNames = [
        'promo-1-mantenimiento.jpg',
        'promo-2-aire-acondicionado.jpg', 
        'promo-3-completo.jpg'
      ];

      localImageNames.forEach((name, index) => {
        const img = new Image();
        img.src = `/images/promotions/${name}`;
        img.onload = () => {
          // Si la imagen carga con éxito, la añadimos al mapa
          setLocalImages(prev => ({ ...prev, [index + 1]: img.src }));
        };
        // Si falla, el navegador no registrará un error crítico de JS
      });
    };

    checkLocalImages();

    const interval = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promotions.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getImageUrl = (promo) => {
    // Prioridad: Imagen local > Imagen de mockData
    return localImages[promo.id] || promo.image;
  };

  const nextPromo = () => {
    setCurrentPromo((prev) => (prev + 1) % promotions.length);
  };

  const prevPromo = () => {
    setCurrentPromo((prev) => (prev - 1 + promotions.length) % promotions.length);
  };

  const handleReservePromo = (promo) => {
    const whatsappNumber = '66385935'; // Número de Confiautos
    const message = encodeURIComponent(
      `¡Hola! Me interesa la promoción: ${promo.title} por $${promo.discountPrice}. ¿Podrían darme una cita?`
    );
    window.open(`https://wa.me/507${whatsappNumber}?text=${message}`, '_blank');
    
    toast({
      title: "Promoción seleccionada",
      description: "Abriendo WhatsApp para tu reserva...",
    });
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white py-20">
      <div className="container mx-auto px-4">
        {/* Header de la Sección */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 px-4 py-1 text-sm bg-red-100 text-red-600 border-none font-helvetica">
            🔥 OFERTAS LIMITADAS
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-helvetica">
            Promociones del Mes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-helvetica">
            Servicios premium con descuentos exclusivos para el cuidado de tu motor.
          </p>
        </div>

        {/* Carousel de Promociones */}
        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden rounded-3xl shadow-xl bg-white">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentPromo * 100}%)` }}
            >
              {promotions.map((promo) => (
                <div key={promo.id} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
                    
                    {/* Lado del Contenido */}
                    <div className="p-8 lg:p-16 flex flex-col justify-center space-y-6">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-red-500" />
                        <span className="text-sm text-gray-500 font-helvetica">
                          Vence: {new Date(promo.validUntil).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="text-3xl lg:text-4xl font-extrabold text-gray-900 font-helvetica">
                        {promo.title}
                      </h3>
                      
                      <p className="text-gray-600 text-lg font-helvetica leading-relaxed">
                        {promo.description}
                      </p>

                      <div className="flex items-baseline space-x-4">
                        <span className="text-4xl font-bold text-red-600 font-helvetica">${promo.discountPrice}</span>
                        <span className="text-xl text-gray-400 line-through font-helvetica">${promo.originalPrice}</span>
                      </div>

                      <div className="space-y-3">
                        <p className="font-bold text-gray-800 text-sm uppercase tracking-wider font-helvetica">Incluye:</p>
                        <ul className="grid grid-cols-1 gap-2">
                          {promo.includes.map((item, idx) => (
                            <li key={idx} className="flex items-center text-gray-700 text-sm font-helvetica">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <Button 
                          onClick={() => handleReservePromo(promo)}
                          className="bg-red-600 hover:bg-red-700 text-white h-12 px-8 rounded-full font-bold shadow-lg shadow-red-200 transition-transform hover:scale-105"
                        >
                          <Tag className="w-5 h-5 mr-2" /> Reservar Promo
                        </Button>
                      </div>
                    </div>

                    {/* Lado de la Imagen */}
                    <div className="relative h-[300px] lg:h-auto overflow-hidden">
                      <img 
                        src={getImageUrl(promo)} 
                        alt={promo.title}
                        className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?q=80&w=1000&auto=format&fit=crop'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-l from-black/20 to-transparent" />
                      {localImages[promo.id] && (
                        <Badge className="absolute top-4 right-4 bg-green-500 text-white border-none">
                          ✓ Real
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navegación */}
          <Button
            onClick={prevPromo}
            variant="ghost"
            size="icon"
            className="absolute -left-6 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full h-12 w-12 hover:bg-gray-100 hidden md:flex"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </Button>
          <Button
            onClick={nextPromo}
            variant="ghost"
            size="icon"
            className="absolute -right-6 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full h-12 w-12 hover:bg-gray-100 hidden md:flex"
          >
            <ArrowRight className="h-6 w-6 text-gray-600" />
          </Button>
        </div>

        {/* Indicadores */}
        <div className="flex justify-center space-x-2 mt-8">
          {promotions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPromo(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentPromo ? 'w-8 bg-red-600' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionsSection;
