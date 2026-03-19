import React, { useState } from 'react';
import HeroSection from '../components/home/HeroSection';
import PromotionsSection from '../components/home/PromotionsSection';
import ServicesPreview from '../components/home/ServicesPreview';
import TestimonialsSection from '../components/home/TestimonialsSection';
import BrandsSection from '../components/home/BrandsSection';
import CTASection from '../components/home/CTASection';
import ServiceRequestModal from '../components/ServiceRequestModal';

const Home = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  const handleServiceRequest = (service) => {
    setSelectedService(service);
    setIsServiceModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      <HeroSection />
      <PromotionsSection />
      <ServicesPreview onServiceRequest={handleServiceRequest} />
      <TestimonialsSection />
      <BrandsSection />
      <CTASection />
      
      {/* Service Request Modal */}
      <ServiceRequestModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        service={selectedService}
      />
    </div>
  );
};

export default Home;