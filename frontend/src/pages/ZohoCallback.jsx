import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';

const ZohoCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Procesando autorización de Zoho Calendar...');

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (error) {
        setStatus('error');
        setMessage(`Error de autorización: ${error}`);
        return;
      }

      if (!code) {
        setStatus('error');
        setMessage('No se recibió código de autorización');
        return;
      }

      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch('/api/admin/zoho/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ code })
        });

        if (response.ok) {
          const data = await response.json();
          setStatus('success');
          setMessage('¡Zoho Calendar autorizado exitosamente! Ahora las citas se crearán automáticamente.');
          
          // Redirect to admin dashboard after 3 seconds
          setTimeout(() => {
            navigate('/admin');
          }, 3000);
        } else {
          const errorData = await response.json();
          setStatus('error');
          setMessage(`Error configurando Zoho: ${errorData.detail}`);
        }
      } catch (error) {
        setStatus('error');
        setMessage('Error procesando autorización');
      }
    };

    handleCallback();
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        {status === 'processing' && (
          <>
            <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Configurando Zoho Calendar</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-green-900 mb-2">¡Autorización Exitosa!</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">Redirigiendo al panel admin...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-900 mb-2">Error de Autorización</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => navigate('/admin')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Volver al Panel Admin
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ZohoCallback;