import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Calendar, Send, User, Car } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import { mockFunctions } from '../data/mockData';
import AppointmentModal from '../components/AppointmentModal';

const Contact = () => {
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    vehicleType: '',
    message: ''
  });
  const [appointmentForm, setAppointmentForm] = useState({
    name: '',
    phone: '',
    service: '',
    vehicleType: '',
    preferredDate: '',
    preferredTime: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  const services = [
    'Aire Acondicionado Automotriz',
    'Chapistería y Pintura',
    'Mecánica Ligera',
    'Cambio de Aceite y Filtros',
    'Diagnóstico Computarizado',
    'Instalación de Papel Ahumado',
    'Reparación de Frenos',
    'Mantenimiento Preventivo',
    'Otro (especificar en mensaje)'
  ];

  const vehicleTypes = [
    'Auto Sedan',
    'SUV/Camioneta',
    'Pick-up',
    'Hatchback',
    'Motocicleta',
    'Vehículo Comercial',
    'Otro'
  ];

  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await mockFunctions.submitContact(contactForm);
      if (result.success) {
        toast({
          title: "¡Mensaje enviado!",
          description: result.message,
        });
        setContactForm({
          name: '',
          email: '',
          phone: '',
          service: '',
          vehicleType: '',
          message: ''
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al enviar el mensaje. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await mockFunctions.bookAppointment(appointmentForm);
      if (result.success) {
        toast({
          title: "¡Cita agendada!",
          description: result.message,
        });
        setAppointmentForm({
          name: '',
          phone: '',
          service: '',
          vehicleType: '',
          preferredDate: '',
          preferredTime: '',
          message: ''
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al agendar la cita. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#D71920] to-[#004A9F] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-helvetica">
              Contáctanos
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 font-helvetica">
              Estamos aquí para ayudarte. Agenda tu cita o envíanos un mensaje
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="px-4 py-2 text-lg bg-white/20 text-white hover:bg-white/30">
                ✓ Respuesta en 24h
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-lg bg-white/20 text-white hover:bg-white/30">
                ✓ Atención personalizada
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-lg bg-white/20 text-white hover:bg-white/30">
                ✓ WhatsApp disponible
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Contact Methods */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-0 bg-white">
            <CardContent
              className="p-6 text-center"
              onClick={() => {
                const message = encodeURIComponent('Hola! Me gustaría obtener información sobre los servicios de Confiautos.');
                window.open(`https://wa.me/50766385935?text=${message}`, '_blank');
              }}
            >
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 font-helvetica">WhatsApp</h3>
              <p className="text-gray-600 text-sm font-helvetica">Respuesta inmediata</p>
              <p className="text-green-600 font-semibold mt-2 font-helvetica">6638-5935</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-0 bg-white">
            <CardContent
              className="p-6 text-center"
              onClick={() => window.open('tel:6638-5935', '_self')}
            >
              <div className="w-16 h-16 bg-[#D71920] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 font-helvetica">Teléfono</h3>
              <p className="text-gray-600 text-sm font-helvetica">Llamada directa</p>
              <p className="text-[#D71920] font-semibold mt-2 font-helvetica">6638-5935</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-0 bg-white">
            <CardContent
              className="p-6 text-center"
              onClick={() => setIsAppointmentModalOpen(true)}
            >
              <div className="w-16 h-16 bg-[#004A9F] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 font-helvetica">Agendar Cita</h3>
              <p className="text-gray-600 text-sm font-helvetica">Reserva tu servicio</p>
              <p className="text-[#004A9F] font-semibold mt-2 font-helvetica">Clic aquí</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-0 bg-white">
            <CardContent
              className="p-6 text-center"
              onClick={() => window.open('mailto:info@conficompraspty.com', '_blank')}
            >
              <div className="w-16 h-16 bg-[#004A9F] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 font-helvetica">Email</h3>
              <p className="text-gray-600 text-sm font-helvetica">Consultas formales</p>
              <p className="text-[#004A9F] font-semibold mt-2 text-xs font-helvetica">info@conficompraspty.com</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-0 bg-white">
            <CardContent
              className="p-6 text-center"
              onClick={() => window.open('https://maps.google.com/?q=Av. Perú con calle 32 Este, Calidonia, Panamá', '_blank')}
            >
              <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 font-helvetica">Ubicación</h3>
              <p className="text-gray-600 text-sm font-helvetica">Visítanos</p>
              <p className="text-gray-600 font-semibold mt-2 text-xs font-helvetica">Av. Perú con calle 32 Este</p>
            </CardContent>
          </Card>
        </div>

        {/* Forms Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Contact Form */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 font-helvetica flex items-center">
                <Send className="w-6 h-6 mr-3 text-[#D71920]" />
                Enviar Mensaje
              </CardTitle>
              <CardDescription className="font-helvetica">
                Cuéntanos cómo podemos ayudarte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block font-helvetica">
                      Nombre Completo *
                    </label>
                    <Input
                      placeholder="Tu nombre"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      required
                      className="font-helvetica"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block font-helvetica">
                      Teléfono *
                    </label>
                    <Input
                      placeholder="6xxx-xxxx"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                      required
                      className="font-helvetica"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block font-helvetica">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    className="font-helvetica"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block font-helvetica">
                      Servicio de Interés
                    </label>
                    <Select
                      value={contactForm.service}
                      onValueChange={(value) => setContactForm({...contactForm, service: value})}
                    >
                      <SelectTrigger className="font-helvetica">
                        <SelectValue placeholder="Seleccionar servicio" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map(service => (
                          <SelectItem key={service} value={service}>{service}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block font-helvetica">
                      Tipo de Vehículo
                    </label>
                    <Select
                      value={contactForm.vehicleType}
                      onValueChange={(value) => setContactForm({...contactForm, vehicleType: value})}
                    >
                      <SelectTrigger className="font-helvetica">
                        <SelectValue placeholder="Tipo de vehículo" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block font-helvetica">
                    Mensaje *
                  </label>
                  <Textarea
                    placeholder="Describe tu consulta o necesidad..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    rows={4}
                    required
                    className="font-helvetica"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#D71920] hover:bg-[#b01319] text-white py-3 font-helvetica"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Appointment Form */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 font-helvetica flex items-center">
                <Calendar className="w-6 h-6 mr-3 text-[#004A9F]" />
                Agendar Cita
              </CardTitle>
              <CardDescription className="font-helvetica">
                Reserva tu servicio en línea
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAppointmentSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block font-helvetica">
                      Nombre Completo *
                    </label>
                    <Input
                      placeholder="Tu nombre"
                      value={appointmentForm.name}
                      onChange={(e) => setAppointmentForm({...appointmentForm, name: e.target.value})}
                      required
                      className="font-helvetica"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block font-helvetica">
                      Teléfono *
                    </label>
                    <Input
                      placeholder="6xxx-xxxx"
                      value={appointmentForm.phone}
                      onChange={(e) => setAppointmentForm({...appointmentForm, phone: e.target.value})}
                      required
                      className="font-helvetica"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block font-helvetica">
                      Servicio Requerido *
                    </label>
                    <Select
                      value={appointmentForm.service}
                      onValueChange={(value) => setAppointmentForm({...appointmentForm, service: value})}
                      required
                    >
                      <SelectTrigger className="font-helvetica">
                        <SelectValue placeholder="Seleccionar servicio" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map(service => (
                          <SelectItem key={service} value={service}>{service}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block font-helvetica">
                      Tipo de Vehículo *
                    </label>
                    <Select
                      value={appointmentForm.vehicleType}
                      onValueChange={(value) => setAppointmentForm({...appointmentForm, vehicleType: value})}
                      required
                    >
                      <SelectTrigger className="font-helvetica">
                        <SelectValue placeholder="Tipo de vehículo" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block font-helvetica">
                      Fecha Preferida *
                    </label>
                    <Input
                      type="date"
                      value={appointmentForm.preferredDate}
                      onChange={(e) => setAppointmentForm({...appointmentForm, preferredDate: e.target.value})}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="font-helvetica"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block font-helvetica">
                      Hora Preferida *
                    </label>
                    <Select
                      value={appointmentForm.preferredTime}
                      onValueChange={(value) => setAppointmentForm({...appointmentForm, preferredTime: value})}
                      required
                    >
                      <SelectTrigger className="font-helvetica">
                        <SelectValue placeholder="Seleccionar hora" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(time => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block font-helvetica">
                    Comentarios Adicionales
                  </label>
                  <Textarea
                    placeholder="Detalles adicionales sobre tu vehículo o servicio..."
                    value={appointmentForm.message}
                    onChange={(e) => setAppointmentForm({...appointmentForm, message: e.target.value})}
                    rows={3}
                    className="font-helvetica"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#004A9F] hover:bg-[#003875] text-white py-3 font-helvetica"
                >
                  {isSubmitting ? 'Agendando...' : 'Agendar Cita'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Business Info & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Business Information */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 font-helvetica">
                Información de Contacto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-[#D71920] mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 font-helvetica">Dirección</h3>
                  <p className="text-gray-600 font-helvetica">
                    Av. Perú con calle 32 Este, a un costado de la Lotería Nacional
                  </p>
                  <p className="text-gray-600 font-helvetica">Calidonia, Panamá</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Clock className="w-6 h-6 text-[#004A9F] mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 font-helvetica">Horarios de Atención</h3>
                  <div className="space-y-1 text-gray-600 font-helvetica">
                    <p>Lunes - Viernes: 8:00 AM - 6:00 PM</p>
                    <p>Sábados: 8:00 AM - 4:00 PM</p>
                    <p>Domingos: Cerrado</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 font-helvetica">Contacto</h3>
                  <div className="space-y-1 text-gray-600 font-helvetica">
                    <p>Teléfono: 6638-5935</p>
                    <p>Email: info@conficompraspty.com</p>
                    <p>Instagram: @ConfiautosPanama</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm font-helvetica">
                  💡 <strong>Tip:</strong> Para una atención más rápida, contáctanos por WhatsApp. 
                  Respondemos inmediatamente en horario de oficina.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Map Placeholder */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 font-helvetica">
                Nuestra Ubicación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="w-full h-80 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:from-gray-300 hover:to-gray-400 transition-colors duration-300"
                onClick={() => window.open('https://maps.google.com/?q=Av. Perú con calle 32 Este, Calidonia, Panamá', '_blank')}
              >
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2 font-helvetica">
                    Ver en Google Maps
                  </h3>
                  <p className="text-gray-600 font-helvetica">
                    Haz clic para obtener direcciones
                  </p>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <Button
                  onClick={() => window.open('https://maps.google.com/?q=Av. Perú con calle 32 Este, Calidonia, Panamá', '_blank')}
                  className="bg-[#004A9F] hover:bg-[#003875] text-white font-helvetica"
                >
                  Cómo Llegar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
      />
    </div>
  );
};

export default Contact;