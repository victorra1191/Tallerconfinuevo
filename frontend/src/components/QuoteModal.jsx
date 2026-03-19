import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Plus, Minus, Trash2, Send, Calculator } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';
import { mockFunctions, getProductImageByType } from '../data/mockData';

const QuoteModal = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [quoteList, setQuoteList] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setQuoteList(mockFunctions.getQuoteList());
    }
  }, [isOpen]);

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeProduct(productId);
      return;
    }

    const updatedList = quoteList.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setQuoteList(updatedList);
    localStorage.setItem('quoteList', JSON.stringify(updatedList));
  };

  const removeProduct = (productId) => {
    const updatedList = mockFunctions.removeFromQuoteList(productId);
    setQuoteList(updatedList);
  };

  const getTotalItems = () => {
    return quoteList.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalValue = () => {
    return quoteList.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const quoteData = {
        customer: customerInfo,
        products: quoteList,
        totalItems: getTotalItems(),
        totalValue: getTotalValue(),
        timestamp: new Date().toISOString()
      };

      const result = await mockFunctions.requestProductQuote(quoteData);
      
      if (result.success) {
        toast({
          title: "¡Cotización enviada!",
          description: result.message,
        });

        // Generate WhatsApp message
        const productList = quoteList.map(item => 
          `• ${item.name} (${item.brand}) - Cantidad: ${item.quantity} - SKU: ${item.sku}`
        ).join('\n');

        const message = encodeURIComponent(
          `¡Hola! Solicito cotización para los siguientes productos:\n\n` +
          `👤 *DATOS DEL CLIENTE:*\n` +
          `Nombre: ${customerInfo.name}\n` +
          `Teléfono: ${customerInfo.phone}\n` +
          `Email: ${customerInfo.email || 'No proporcionado'}\n\n` +
          `🛒 *PRODUCTOS SOLICITADOS:*\n${productList}\n\n` +
          `📊 *RESUMEN:*\n` +
          `Total de productos: ${getTotalItems()} unidades\n` +
          `Valor estimado: $${getTotalValue().toFixed(2)}\n\n` +
          `📝 *Notas adicionales:*\n${customerInfo.notes || 'Ninguna'}\n\n` +
          `¡Gracias por confiar en Confiautos! 🔧✨`
        );
        
        window.open(`https://wa.me/50766385935?text=${message}`, '_blank');
        
        // Clear quote list and close modal
        localStorage.removeItem('quoteList');
        setQuoteList([]);
        setCustomerInfo({ name: '', phone: '', email: '', notes: '' });
        onClose();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al enviar la cotización. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#004A9F] to-[#D71920] text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-helvetica">Solicitar Cotización</h2>
                <p className="text-white/90 font-helvetica">
                  {getTotalItems()} producto{getTotalItems() !== 1 ? 's' : ''} seleccionado{getTotalItems() !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {quoteList.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-helvetica">
              Lista de cotización vacía
            </h3>
            <p className="text-gray-600 font-helvetica">
              Agrega productos desde el catálogo para solicitar una cotización
            </p>
            <Button
              onClick={() => {
                onClose();
                window.location.href = '/productos';
              }}
              className="mt-4 bg-[#D71920] hover:bg-[#b01319] text-white font-helvetica"
            >
              Ver Productos
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmitQuote} className="p-6 space-y-6">
            {/* Products List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 font-helvetica flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2 text-[#D71920]" />
                Productos Seleccionados
              </h3>
              
              <div className="space-y-3">
                {quoteList.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                      <img 
                        src={getProductImageByType(item)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <span className="text-2xl" style={{display: 'none'}}>📦</span>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 font-helvetica">{item.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">{item.brand}</Badge>
                        <span className="text-xs text-gray-500 font-helvetica">SKU: {item.sku}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 font-helvetica">{item.uses}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      
                      <span className="w-12 text-center font-semibold font-helvetica">
                        {item.quantity}
                      </span>
                      
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-[#D71920] font-helvetica">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500 font-helvetica">
                        ${item.price.toFixed(2)} c/u
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeProduct(item.id)}
                      className="w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="bg-gradient-to-r from-[#D71920]/10 to-[#004A9F]/10 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900 font-helvetica">
                    Total Estimado:
                  </span>
                  <span className="text-2xl font-bold text-[#D71920] font-helvetica">
                    ${getTotalValue().toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1 font-helvetica">
                  *Precio final sujeto a disponibilidad y condiciones de pago
                </p>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 font-helvetica">
                Información de Contacto
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block font-helvetica">
                    Nombre Completo *
                  </label>
                  <Input
                    placeholder="Tu nombre completo"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
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
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    required
                    className="font-helvetica"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block font-helvetica">
                  Email (opcional)
                </label>
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                  className="font-helvetica"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block font-helvetica">
                  Notas adicionales
                </label>
                <Textarea
                  placeholder="Información adicional sobre tu consulta..."
                  value={customerInfo.notes}
                  onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                  rows={3}
                  className="font-helvetica"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 font-helvetica"
              >
                Continuar Comprando
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-[#D71920] to-[#004A9F] hover:from-[#b01319] hover:to-[#003875] text-white font-helvetica"
              >
                {isSubmitting ? (
                  'Enviando...'
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Cotización
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default QuoteModal;