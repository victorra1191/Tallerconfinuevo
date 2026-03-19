import React, { useState, useEffect } from 'react';
import { Star, Award, Shield } from 'lucide-react';

const BrandsSection = () => {
  const [brandLogos, setBrandLogos] = useState({});
  
  const brands = [
    { name: 'Motul', specialty: 'Aceites Premium', description: 'Lubricantes de alta performance', logo: 'motul.png' },
    { name: 'Wurth', specialty: 'Químicos Automotrices', description: 'Productos profesionales alemanes', logo: 'wurth.png' },
    { name: 'ENI', specialty: 'Lubricantes', description: 'Tecnología italiana para motores', logo: 'eni.png' },
    { name: 'A1', specialty: 'Limpiadores', description: 'Sistemas de limpieza especializados', logo: 'a1.png' },
    { name: 'Liqui Moly', specialty: 'Aditivos', description: 'Innovación alemana en aditivos', logo: 'liqui-moly.png' },
    { name: 'Genérico', specialty: 'Repuestos', description: 'Calidad garantizada a buen precio', logo: 'generico.png' }
  ];

  useEffect(() => {
    // Check for brand logos
    const checkBrandLogos = async () => {
      const logoMap = {};
      
      for (const brand of brands) {
        try {
          const response = await fetch(`/images/marcas/${brand.logo}`, { method: 'HEAD' });
          if (response.ok) {
            logoMap[brand.name] = `/images/marcas/${brand.logo}`;
          }
        } catch (error) {
          // Logo not found, will use fallback
        }
      }
      
      setBrandLogos(logoMap);
    };

    checkBrandLogos();
  }, []);

  const renderBrandIcon = (brand) => {
    if (brandLogos[brand.name]) {
      return (
        <img 
          src={brandLogos[brand.name]} 
          alt={`Logo ${brand.name}`}
          className="w-12 h-12 object-contain"
          onError={() => {
            // Remove from logoMap if image fails to load
            setBrandLogos(prev => {
              const newMap = {...prev};
              delete newMap[brand.name];
              return newMap;
            });
          }}
        />
      );
    }
    
    // Fallback icon
    return <Star className="w-10 h-10 text-white" />;
  };

  const renderBrandLogo = (brand) => {
    if (brandLogos[brand.name]) {
      return (
        <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-300">
          <img 
            src={brandLogos[brand.name]} 
            alt={`Logo ${brand.name}`}
            className="w-12 h-12 object-contain"
          />
        </div>
      );
    }
    
    // Fallback
    return (
      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-2 hover:bg-gray-300 transition-colors duration-300">
        <span className="text-gray-600 font-bold text-sm font-helvetica">
          {brand.name.slice(0, 3).toUpperCase()}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-helvetica">
            Marcas de Confianza
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-helvetica">
            Trabajamos con las mejores marcas del mercado automotriz para garantizar 
            la calidad y durabilidad que tu vehículo merece
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* Brand Icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-[#D71920] to-[#004A9F] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                {renderBrandIcon(brand)}
              </div>

              {/* Brand Info */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#D71920] transition-colors duration-300 font-helvetica">
                  {brand.name}
                </h3>
                <p className="text-[#004A9F] font-semibold mb-3 font-helvetica">
                  {brand.specialty}
                </p>
                <p className="text-gray-600 font-helvetica">
                  {brand.description}
                </p>
              </div>

              {/* Hover Effect */}
              <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-full h-1 bg-gradient-to-r from-[#D71920] to-[#004A9F] rounded-full"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Quality Guarantees */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-helvetica">
              Garantía de Calidad
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-helvetica">
              Todos nuestros productos cuentan con certificaciones internacionales y garantía de calidad
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Quality Assurance */}
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2 font-helvetica">Productos Originales</h4>
              <p className="text-gray-600 font-helvetica">
                Garantizamos la autenticidad de todas las marcas que manejamos
              </p>
            </div>

            {/* Certification */}
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2 font-helvetica">Certificaciones</h4>
              <p className="text-gray-600 font-helvetica">
                Productos con certificaciones internacionales de calidad
              </p>
            </div>

            {/* Warranty */}
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-[#D71920] to-[#004A9F] rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2 font-helvetica">Garantía Extendida</h4>
              <p className="text-gray-600 font-helvetica">
                Respaldamos nuestros productos con garantía extendida
              </p>
            </div>
          </div>
        </div>

        {/* Brand Logos Animation (simulated) */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h4 className="text-2xl font-bold text-gray-900 font-helvetica">
              Distribuidores Autorizados
            </h4>
          </div>
          
          <div className="flex justify-center items-center space-x-8 md:space-x-12 overflow-hidden">
            {brands.map((brand, index) => (
              <div
                key={index}
                className="text-center min-w-0 animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {renderBrandLogo(brand)}
                <p className="text-sm text-gray-600 font-helvetica truncate mt-2">
                  {brand.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="text-lg text-gray-600 mb-6 font-helvetica">
            ¿Buscas una marca o producto específico?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/productos'}
              className="bg-[#D71920] hover:bg-[#b01319] text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-helvetica"
            >
              Ver Catálogo Completo
            </button>
            <button
              onClick={() => {
                const message = encodeURIComponent('Hola! Busco un producto de una marca específica. ¿Podrían ayudarme?');
                window.open(`https://wa.me/50766385935?text=${message}`, '_blank');
              }}
              className="border-2 border-[#004A9F] text-[#004A9F] hover:bg-[#004A9F] hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 font-helvetica"
            >
              Consultar Disponibilidad
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandsSection;