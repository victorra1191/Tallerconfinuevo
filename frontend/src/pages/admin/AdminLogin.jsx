import React, { useState } from 'react';
import { User, Lock, LogIn } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useToast } from '../../hooks/use-toast';

const AdminLogin = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Formatear los datos como x-www-form-urlencoded para que FastAPI los acepte
      const formBody = new URLSearchParams();
      formBody.append('username', formData.username);
      formBody.append('password', formData.password);

      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody
      });

      const data = await response.json();

      if (response.ok) {
        // Guardamos el token. Asegúrate de que coincida con lo que espera tu app (admin_token o adminToken)
        localStorage.setItem('admin_token', data.access_token);
        localStorage.setItem('adminToken', data.access_token); // Guardamos ambos por si acaso
        
        // Si tu backend no devuelve el objeto user, evitamos que marque error
        const userName = data.user ? data.user.full_name : 'Administrador';
        
        toast({
          title: "Login exitoso",
          description: `Bienvenido, ${userName}!`,
          className: "bg-green-500 text-white border-none",
        });

        // Redirigir al dashboard
        setTimeout(() => {
          window.location.href = '/admin/dashboard';
        }, 1000);
      } else {
        throw new Error(data.detail || 'Credenciales incorrectas');
      }
    } catch (error) {
      toast({
        title: "Error de autenticación",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#D71920] to-[#004A9F] rounded-2xl flex items-center justify-center mb-4">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Panel Administrativo
          </h2>
          <p className="mt-2 text-gray-600">
            Confiautos Panama - Acceso restringido
          </p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
            <CardDescription className="text-center">
              Ingresa tus credenciales de administrador
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Usuario
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      className="pl-10"
                      placeholder="Nombre de usuario"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="pl-10"
                      placeholder="Contraseña"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#D71920] to-[#b01319] hover:from-[#b01319] hover:to-[#8a0f15] text-white font-semibold py-3 transition-all duration-300"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Autenticando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <LogIn className="h-5 w-5" />
                      <span>Iniciar Sesión</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Confiautos Panama. Todos los derechos reservados.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Sistema seguro protegido por autenticación JWT
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
