import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { testimonials } from '../../data/mockData';

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentData = testimonials[currentTestimonial];

  return (
    <div className="bg-gradient-to-br from-[#004A9F] to-[#D71920] py-20 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-40 h-40 border border-white/20 rounded-full"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-32 left-1/4 w-32 h-32 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-16 h-16 border border-white/20 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-helvetica">
            Lo Que Dicen Nuestros Clientes
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto font-helvetica">
            La confianza de nuestros clientes es nuestro mayor logro. Conoce sus experiencias reales
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Main Testimonial Card */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardContent className="p-8 md:p-12">
                <div className="text-center">
                  {/* Quote Icon */}
                  <Quote className="w-16 h-16 text-white/50 mx-auto mb-6" />
                  
                  {/* Rating Stars */}
                  <div className="flex justify-center space-x-1 mb-6">
                    {[...Array(currentData.rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <blockquote className="text-xl md:text-2xl leading-relaxed mb-8 font-helvetica">
                    "{currentData.comment}"
                  </blockquote>

                  {/* Customer Info */}
                  <div className="flex items-center justify-center space-x-4">
                    <Avatar className="w-16 h-16 border-2 border-white/30">
                      <AvatarImage src={currentData.avatar} alt={currentData.name} />
                      <AvatarFallback className="bg-white/20 text-white text-lg font-bold">
                        {currentData.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <h4 className="text-lg font-bold font-helvetica">{currentData.name}</h4>
                      <p className="text-white/80 font-helvetica">Servicio: {currentData.service}</p>
                      <p className="text-white/60 text-sm font-helvetica">
                        {new Date(currentData.date).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Arrows */}
            <Button
              onClick={prevTestimonial}
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              onClick={nextTestimonial}
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          {/* All Testimonials Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {testimonials.map((testimonial, index) => (
              <Card
                key={testimonial.id}
                className={`cursor-pointer transition-all duration-300 ${
                  index === currentTestimonial
                    ? 'bg-white/20 border-white/40 scale-105'
                    : 'bg-white/10 border-white/20 hover:bg-white/15'
                }`}
                onClick={() => setCurrentTestimonial(index)}
              >
                <CardContent className="p-6 text-center">
                  <Avatar className="w-12 h-12 mx-auto mb-4 border border-white/30">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-white/20 text-white text-sm font-bold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h4 className="font-bold text-white mb-1 font-helvetica">{testimonial.name}</h4>
                  <p className="text-white/80 text-sm font-helvetica">{testimonial.service}</p>
                  <div className="flex justify-center space-x-1 mt-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-20">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2 font-helvetica">500+</div>
            <p className="text-white/80 font-helvetica">Clientes Satisfechos</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2 font-helvetica">15+</div>
            <p className="text-white/80 font-helvetica">Años de Experiencia</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2 font-helvetica">98%</div>
            <p className="text-white/80 font-helvetica">Satisfacción del Cliente</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2 font-helvetica">24h</div>
            <p className="text-white/80 font-helvetica">Tiempo de Respuesta</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-xl mb-6 text-white/90 font-helvetica">
            ¿Quieres ser nuestro próximo cliente satisfecho?
          </p>
          <Button
            onClick={() => {
              const message = encodeURIComponent('Hola! He visto las excelentes reseñas de sus clientes y me gustaría conocer más sobre sus servicios.');
              window.open(`https://wa.me/50766385935?text=${message}`, '_blank');
            }}
            className="bg-white text-[#004A9F] hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-helvetica"
          >
            Contactar Ahora
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;