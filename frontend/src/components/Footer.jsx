import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Instagram, Facebook } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from '../hooks/use-toast';
import { mockFunctions } from '../data/mockData';

const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = React.useState('');

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      const result = await mockFunctions.subscribeNewsletter(email);
      if (result.success) {
        toast({
          title: "¡Suscripción exitosa!",
          description: result.message,
        });
        setEmail('');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema con la suscripción. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#D71920] to-[#004A9F] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg font-helvetica">C</span>
              </div>
              <div>
                <h3 className="text-xl font-bold font-helvetica">CONFIAUTOS</h3>
                <p className="text-sm text-gray-400 font-helvetica">Confianza y Garantía</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed font-helvetica">
              Más que un taller, somos tu centro integral de confianza para el cuidado vehicular. 
              Tecnología, experiencia y atención personalizada en el corazón de Panamá.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/ConfiautosPanama"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#D71920] transition-colors duration-300"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com/ConfiautosPanama"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#004A9F] transition-colors duration-300"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold font-helvetica">Enlaces Rápidos</h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/servicios" className="text-gray-300 hover:text-[#D71920] transition-colors duration-300 font-helvetica">
                Nuestros Servicios
              </Link>
              <Link to="/productos" className="text-gray-300 hover:text-[#D71920] transition-colors duration-300 font-helvetica">
                Catálogo de Productos
              </Link>
              <Link to="/nosotros" className="text-gray-300 hover:text-[#D71920] transition-colors duration-300 font-helvetica">
                Sobre Nosotros
              </Link>
              <Link to="/blog" className="text-gray-300 hover:text-[#D71920] transition-colors duration-300 font-helvetica">
                Blog Automotriz
              </Link>
              <Link to="/contacto" className="text-gray-300 hover:text-[#D71920] transition-colors duration-300 font-helvetica">
                Contacto
              </Link>
            </nav>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold font-helvetica">Servicios Destacados</h4>
            <nav className="flex flex-col space-y-2">
              <span className="text-gray-300 font-helvetica">Aire Acondicionado Automotriz</span>
              <span className="text-gray-300 font-helvetica">Chapistería y Pintura</span>
              <span className="text-gray-300 font-helvetica">Mecánica Ligera</span>
              <span className="text-gray-300 font-helvetica">Papel Ahumado</span>
              <span className="text-gray-300 font-helvetica">Diagnóstico Computarizado</span>
              <span className="text-gray-300 font-helvetica">Cambio de Aceite</span>
            </nav>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold font-helvetica">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#D71920] mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm font-helvetica">
                  Av. Perú con calle 32 Este, a un costado de la Lotería Nacional, Calidonia, Panamá
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#D71920]" />
                <a href="tel:6638-5935" className="text-gray-300 hover:text-white transition-colors duration-300 font-helvetica">
                  6638-5935
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#D71920]" />
                <a href="mailto:info@conficompraspty.com" className="text-gray-300 hover:text-white transition-colors duration-300 font-helvetica">
                  info@conficompraspty.com
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-[#D71920] mt-0.5" />
                <div className="text-gray-300 text-sm font-helvetica">
                  <div>Lun - Vie: 8:00 AM - 6:00 PM</div>
                  <div>Sábado: 8:00 AM - 4:00 PM</div>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="pt-4 border-t border-gray-800">
              <h5 className="text-sm font-semibold mb-2 font-helvetica">Recibe Ofertas Exclusivas</h5>
              <form onSubmit={handleNewsletterSubmit} className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Tu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 font-helvetica"
                />
                <Button
                  type="submit"
                  className="bg-[#D71920] hover:bg-[#b01319] text-white px-4 font-helvetica"
                >
                  Suscribir
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm font-helvetica">
              <p className="mb-1">© 2020-{new Date().getFullYear()} Confiautos Panamá. Todos los derechos reservados.</p>
              <p>
                Sitio web creado por{' '}
                <a 
                  href="mailto:victor@sparkadpa.com" 
                  className="text-[#D71920] hover:text-[#b01319] transition-colors duration-300 font-semibold"
                >
                  Spark Ads Pa
                </a>
              </p>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300 font-helvetica">
                Política de Privacidad
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300 font-helvetica">
                Términos y Condiciones
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;