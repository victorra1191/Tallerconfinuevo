import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Menu, X, MapPin } from 'lucide-react';
import { Button } from './ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasLogo, setHasLogo] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check if logo exists with multiple possible names and extensions
    const checkLogo = async () => {
      const possibleLogos = [
        '/images/logo/logo-confiautos.png',
        '/images/logo/logo-confiautos.svg',
        '/images/logo/logo-confiautos.jpg',
        '/images/logo/logo-confiautos.jpeg',
        '/images/logo/confiautos-logo.png',
        '/images/logo/confiautos.png',
        '/images/logo/logo.png',
        '/images/logo.png',
        '/images/confiautos.png'
      ];

      for (const logoPath of possibleLogos) {
        try {
          const response = await fetch(logoPath, { method: 'HEAD' });
          if (response.ok) {
            setHasLogo(logoPath);
            console.log('Logo found:', logoPath);
            return;
          }
        } catch (error) {
          // Continue to next logo option
        }
      }
      console.log('No logo found, using fallback');
      setHasLogo(false);
    };
    
    checkLogo();
  }, []);

  const navigationItems = [
    { name: 'Inicio', path: '/' },
    { name: 'Servicios', path: '/servicios' },
    { name: 'Productos', path: '/productos' },
    { name: 'Nosotros', path: '/nosotros' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contacto', path: '/contacto' }
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#D71920] text-white py-2 px-4 hidden md:block">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Av. Perú con calle 32 Este, Calidonia, Panamá</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>6638-5935</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span>Lun - Vie: 8:00 AM - 6:00 PM | Sáb: 8:00 AM - 4:00 PM</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              {hasLogo ? (
                <img 
                  src={hasLogo} 
                  alt="Confiautos Panama" 
                  className="h-12 w-auto max-w-48"
                  onError={() => setHasLogo(false)}
                />
              ) : (
                <>
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D71920] to-[#004A9F] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl font-helvetica">C</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-helvetica">CONFIAUTOS</h1>
                    <p className="text-sm text-gray-600 font-helvetica">Confianza y Garantía</p>
                  </div>
                </>
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`font-helvetica font-medium transition-all duration-300 hover:text-[#D71920] relative ${
                    location.pathname === item.path
                      ? 'text-[#D71920]'
                      : 'text-gray-700'
                  }`}
                >
                  {item.name}
                  {location.pathname === item.path && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#D71920] rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center space-x-4">
              <Button
                className="bg-[#004A9F] hover:bg-[#003875] text-white px-6 py-2 rounded-lg font-helvetica font-medium transition-all duration-300 hover:shadow-lg"
                onClick={() => window.open('https://wa.me/50766385935?text=Hola, necesito información sobre sus servicios', '_blank')}
              >
                Agenda tu Cita
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`font-helvetica font-medium py-2 transition-colors duration-300 ${
                      location.pathname === item.path
                        ? 'text-[#D71920] border-l-4 border-[#D71920] pl-4'
                        : 'text-gray-700 hover:text-[#D71920] pl-4'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <Button
                  className="bg-[#004A9F] hover:bg-[#003875] text-white w-full mt-4 font-helvetica"
                  onClick={() => {
                    window.open('https://wa.me/50766385935?text=Hola, necesito información sobre sus servicios', '_blank');
                    setIsMenuOpen(false);
                  }}
                >
                  Agenda tu Cita
                </Button>
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;