import React, { useState, useEffect } from 'react';
import { ArrowRight, Shield, Clock, Star, Wrench } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const heroSlides = [
    {
      title: "Confianza y Garantía en Cada Servicio",
      subtitle: "Más que un taller, somos tu centro integral de confianza vehicular",
      description: "Tecnología de punta, personal certificado y atención personalizada en el corazón de Panamá",
      cta: "Agenda tu Cita",
      features: ["Diagnóstico Computarizado", "Garantía de Calidad", "Personal Certificado"],
      bgImage: "https://images.unsplash.com/photo-1596986952526-3be237187071?w=1920&h=1080&fit=crop",
      bgGradient: "from-[#D71920]/70 via-[#b01319]/50 to-[#004A9F]/70"
    },
    {
      title: "Aire Acondicionado Automotriz",
      subtitle: "Especialistas en sistemas de climatización vehicular",
      description: "Diagnóstico avanzado, reparación profesional y mantenimiento preventivo con equipos de última generación",
      cta: "Solicitar Servicio",
      features: ["Equipos Modernos", "Técnicos Especializados", "Garantía 1 Año"],
      bgImage: "https://images.pexels.com/photos/8986070/pexels-photo-8986070.jpeg?w=1920&h=1080&fit=crop",
      bgGradient: "from-[#004A9F]/70 via-[#003875]/50 to-[#D71920]/70"
    },
    {
      title: "Productos Premium para tu Auto",
      subtitle: "Aceites Motul, productos Wurth y más marcas reconocidas",
      description: "Catálogo completo de productos automotrices con la mejor relación calidad-precio",
      cta: "Ver Productos",
      features: ["Marcas Reconocidas", "Precios Competitivos", "Entrega Inmediata"],
      bgImage: "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=1920&h=1080&fit=crop",
      bgGradient: "from-[#D71920]/70 via-[#004A9F]/50 to-[#b01319]/70"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCTA = (slideIndex) => {
    switch (slideIndex) {
      case 0:
        window.location.href = '/contacto';
        break;
      case 1:
        const acMessage = encodeURIComponent('Hola! Me interesa el servicio de Aire Acondicionado Automotriz. ¿Podrían darme más información?');
        window.open(`https://wa.me/50766385935?text=${acMessage}`, '_blank');
        break;
      case 2:
        window.location.href = '/productos';
        break;
    }
  };

  const currentSlideData = heroSlides[currentSlide];

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{
          backgroundImage: `url(${currentSlideData.bgImage})`
        }}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.bgGradient} transition-all duration-1000`}></div>
        
        {/* Animated Geometric Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-white/5 rounded-full animate-bounce delay-1000"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-white/5 rounded-full animate-pulse delay-2000"></div>
          <div className="absolute bottom-20 right-20 w-20 h-20 bg-white/10 rounded-full animate-bounce delay-500"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-5xl mx-auto">
          {/* Logo/Brand */}
          <div className="mb-8 animate-fade-in">
            <div className="inline-flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Wrench className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold font-helvetica">CONFIAUTOS PANAMÁ</h1>
                <p className="text-lg text-white/90 font-helvetica">Confianza y Garantía</p>
              </div>
            </div>
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-helvetica leading-tight">
            <span className="block animate-slide-up">{currentSlideData.title}</span>
          </h2>

          {/* Subtitle */}
          <h3 className="text-xl md:text-2xl lg:text-3xl mb-4 text-white/90 font-helvetica animate-slide-up delay-200">
            {currentSlideData.subtitle}
          </h3>

          {/* Description */}
          <p className="text-base md:text-lg lg:text-xl mb-8 text-white/80 max-w-3xl mx-auto font-helvetica animate-slide-up delay-400">
            {currentSlideData.description}
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-4 mb-8 animate-slide-up delay-600">
            {currentSlideData.features.map((feature, index) => (
              <Badge 
                key={index}
                variant="secondary"
                className="px-4 py-2 text-sm bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300 font-helvetica"
              >
                ✓ {feature}
              </Badge>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up delay-800">
            <Button
              size="lg"
              onClick={() => handleCTA(currentSlide)}
              className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-helvetica"
            >
              {currentSlideData.cta}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                const message = encodeURIComponent('Hola! Visitando su página web y me interesa conocer más sobre sus servicios.');
                window.open(`https://wa.me/50766385935?text=${message}`, '_blank');
              }}
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-helvetica"
            >
              WhatsApp
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-slide-up delay-1000">
            <div className="flex items-center justify-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Shield className="w-8 h-8 text-white" />
              <div className="text-left">
                <h4 className="font-semibold font-helvetica">Garantía Total</h4>
                <p className="text-sm text-white/80 font-helvetica">En todos nuestros servicios</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Clock className="w-8 h-8 text-white" />
              <div className="text-left">
                <h4 className="font-semibold font-helvetica">Servicio Rápido</h4>
                <p className="text-sm text-white/80 font-helvetica">Respuesta inmediata</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Star className="w-8 h-8 text-white" />
              <div className="text-left">
                <h4 className="font-semibold font-helvetica">+15 Años</h4>
                <p className="text-sm text-white/80 font-helvetica">De experiencia</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;