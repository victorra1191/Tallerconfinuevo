import React from 'react';
import { Users, Award, Shield, Clock, Heart, Target, Eye, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Confianza',
      description: 'Construimos relaciones duraderas basadas en la honestidad y transparencia con cada cliente.'
    },
    {
      icon: Award,
      title: 'Excelencia',
      description: 'Nos comprometemos a ofrecer servicios de la más alta calidad con los mejores estándares.'
    },
    {
      icon: Shield,
      title: 'Garantía',
      description: 'Respaldamos nuestro trabajo con garantías sólidas que te dan tranquilidad total.'
    },
    {
      icon: Users,
      title: 'Atención Personalizada',
      description: 'Cada cliente es único y merece una atención especializada y dedicada.'
    }
  ];

  const milestones = [
    { year: '2008', title: 'Fundación', description: 'Inicio de operaciones en Calidonia' },
    { year: '2012', title: 'Expansión de Servicios', description: 'Incorporación de diagnóstico computarizado' },
    { year: '2016', title: 'Modernización', description: 'Equipos de última generación para A/C' },
    { year: '2020', title: 'Digitalización', description: 'Implementación de sistemas digitales' },
    { year: '2024', title: 'Nueva Era', description: 'Presencia digital y servicios premium' }
  ];

  const certifications = [
    'Técnicos Certificados en Sistemas A/C',
    'Especialistas en Diagnóstico Automotriz',
    'Certificación en Manejo de Refrigerantes',
    'Capacitación Continua en Nuevas Tecnologías',
    'Estándares de Calidad ISO',
    'Certificación en Seguridad Industrial'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#004A9F] to-[#D71920] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-helvetica">
              Sobre Nosotros
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 font-helvetica">
              Más que un taller, somos tu centro integral de confianza vehicular
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="px-4 py-2 text-lg bg-white/20 text-white hover:bg-white/30">
                ✓ +15 años de experiencia
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-lg bg-white/20 text-white hover:bg-white/30">
                ✓ +500 clientes satisfechos
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-lg bg-white/20 text-white hover:bg-white/30">
                ✓ Tecnología de punta
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-helvetica">
              Nuestra Historia
            </h2>
            <div className="space-y-4 text-gray-600 font-helvetica">
              <p className="text-lg leading-relaxed">
                <strong>Confiautos Panamá</strong> nació en 2008 con una visión clara: brindar servicios 
                automotrices de calidad premium con honestidad, transparencia y un toque personal 
                que nos distingue en el mercado panameño.
              </p>
              <p className="text-lg leading-relaxed">
                Ubicados estratégicamente en <strong>Av. Perú con calle 32 Este, Calidonia</strong>, 
                hemos sido testigos del crecimiento de la ciudad y hemos evolucionado junto con 
                las necesidades de nuestros clientes.
              </p>
              <p className="text-lg leading-relaxed">
                Lo que comenzó como un pequeño taller familiar se ha convertido en un 
                <strong> centro integral de servicios automotrices</strong> que combina experiencia 
                tradicional con tecnología de última generación.
              </p>
            </div>
            <Button
              className="mt-6 bg-[#D71920] hover:bg-[#b01319] text-white px-8 py-3 font-helvetica"
              onClick={() => {
                const message = encodeURIComponent('Hola! Me gustaría conocer más sobre la historia y servicios de Confiautos.');
                window.open(`https://wa.me/50766385935?text=${message}`, '_blank');
              }}
            >
              Contactar Ahora
            </Button>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-[#D71920]/10 to-[#004A9F]/10 rounded-2xl p-8 h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-4">🏢</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 font-helvetica">
                  +15 Años
                </h3>
                <p className="text-gray-600 font-helvetica">
                  Sirviendo a la comunidad panameña
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission, Vision & Values */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-helvetica">
              Misión, Visión y Valores
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Mission */}
            <Card className="border-0 bg-gradient-to-br from-[#D71920]/5 to-[#D71920]/10">
              <CardHeader>
                <div className="w-16 h-16 bg-[#D71920] rounded-full flex items-center justify-center mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 font-helvetica">
                  Nuestra Misión
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg leading-relaxed font-helvetica">
                  Brindar servicios automotrices integrales de alta calidad, utilizando tecnología 
                  de punta y el expertise de nuestro equipo certificado, para garantizar la 
                  satisfacción total de nuestros clientes y la óptima performance de sus vehículos.
                </p>
              </CardContent>
            </Card>

            {/* Vision */}
            <Card className="border-0 bg-gradient-to-br from-[#004A9F]/5 to-[#004A9F]/10">
              <CardHeader>
                <div className="w-16 h-16 bg-[#004A9F] rounded-full flex items-center justify-center mb-4">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 font-helvetica">
                  Nuestra Visión
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg leading-relaxed font-helvetica">
                  Ser reconocidos como el centro automotriz líder en Panamá, destacando por 
                  nuestra innovación, confiabilidad y compromiso con la excelencia, expandiendo 
                  nuestros servicios para satisfacer todas las necesidades vehiculares.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Values */}
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center font-helvetica">
              Nuestros Valores
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <Card
                    key={index}
                    className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white"
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#D71920] to-[#004A9F] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-3 font-helvetica">
                        {value.title}
                      </h4>
                      <p className="text-gray-600 font-helvetica">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-helvetica">
              Nuestra Evolución
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-helvetica">
              Un recorrido por los momentos más importantes de nuestra historia
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#D71920] to-[#004A9F]"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex items-center ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  <div className="flex-1 p-6">
                    <Card className={`${
                      index % 2 === 0 ? 'mr-8' : 'ml-8'
                    } border-0 shadow-lg hover:shadow-xl transition-shadow duration-300`}>
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#D71920] to-[#004A9F] rounded-full flex items-center justify-center mr-4">
                            <span className="text-white font-bold font-helvetica">
                              {milestone.year.slice(-2)}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 font-helvetica">
                              {milestone.title}
                            </h3>
                            <p className="text-[#D71920] font-semibold font-helvetica">
                              {milestone.year}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-600 font-helvetica">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Timeline Dot */}
                  <div className="w-6 h-6 bg-white border-4 border-[#D71920] rounded-full z-10"></div>

                  <div className="flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Certifications & Expertise */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Certifications */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 font-helvetica">
                Certificaciones y Expertise
              </h3>
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                  >
                    <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0" />
                    <span className="text-gray-700 font-helvetica">{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Choose Us */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 font-helvetica">
                ¿Por Qué Elegirnos?
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#D71920] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2 font-helvetica">Atención Rápida</h4>
                    <p className="text-gray-600 font-helvetica">
                      Respuesta inmediata y servicios eficientes sin comprometer la calidad
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#004A9F] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2 font-helvetica">Calidad Garantizada</h4>
                    <p className="text-gray-600 font-helvetica">
                      Trabajos respaldados con garantía y productos de marcas reconocidas
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2 font-helvetica">Equipo Experto</h4>
                    <p className="text-gray-600 font-helvetica">
                      Personal certificado y en constante capacitación tecnológica
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-helvetica">
            ¿Listo para Conocer la Diferencia?
          </h2>
          <p className="text-xl mb-8 text-gray-300 max-w-3xl mx-auto font-helvetica">
            Únete a los cientos de clientes que han confiado en nosotros. 
            Experimenta nuestro servicio personalizado y calidad garantizada.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-[#D71920] hover:bg-[#b01319] text-white px-8 py-3 font-helvetica"
              onClick={() => window.location.href = '/contacto'}
            >
              Agendar Cita
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 font-helvetica"
              onClick={() => {
                const message = encodeURIComponent('Hola! Después de conocer su historia y valores, me gustaría obtener más información sobre sus servicios.');
                window.open(`https://wa.me/50766385935?text=${message}`, '_blank');
              }}
            >
              Contactar por WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;