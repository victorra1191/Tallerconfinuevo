import React, { useState, useEffect } from 'react';
import { MessageCircle, Phone, Calendar, ChevronUp, Calculator } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import QuoteModal from './QuoteModal';
import { mockFunctions } from '../data/mockData';

const FloatingActions = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [quoteCount, setQuoteCount] = useState(0);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    const updateQuoteCount = () => {
      const quoteList = mockFunctions.getQuoteList();
      setQuoteCount(quoteList.reduce((total, item) => total + item.quantity, 0));
    };

    updateQuoteCount();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('storage', updateQuoteCount);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', updateQuoteCount);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent('Hola! Me interesa información sobre los servicios de Confiautos. ¿Podrían ayudarme?');
    window.open(`https://wa.me/50766385935?text=${message}`, '_blank');
  };

  const makeCall = () => {
    window.open('tel:6638-5935', '_self');
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3">
        {/* Quote Button */}
        {quoteCount > 0 && (
          <Button
            onClick={() => setIsQuoteModalOpen(true)}
            className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group flex items-center justify-center relative"
            title="Ver cotización"
          >
            <Calculator className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              {quoteCount}
            </Badge>
          </Button>
        )}

        {/* WhatsApp Button */}
        <Button
          onClick={openWhatsApp}
          className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group flex items-center justify-center animate-pulse hover:animate-none"
          title="Chatea con nosotros"
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
        </Button>

        {/* Call Button */}
        <Button
          onClick={makeCall}
          className="w-14 h-14 bg-[#D71920] hover:bg-[#b01319] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group flex items-center justify-center"
          title="Llamar ahora"
        >
          <Phone className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
        </Button>

        {/* Book Appointment Button */}
        <Button
          onClick={() => window.location.href = '/contacto'}
          className="w-14 h-14 bg-[#004A9F] hover:bg-[#003875] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group flex items-center justify-center"
          title="Agendar cita"
        >
          <Calendar className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
        </Button>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <Button
            onClick={scrollToTop}
            className="w-12 h-12 bg-gray-700 hover:bg-gray-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group flex items-center justify-center"
            title="Ir arriba"
          >
            <ChevronUp className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          </Button>
        )}
      </div>

      {/* Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />
    </>
  );
};

export default FloatingActions;