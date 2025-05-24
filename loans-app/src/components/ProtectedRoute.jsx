import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../hooks/useSupabaseAuth';

const ProtectedRoute = ({ user }) => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Verificar la sesión actual
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log('No hay sesión activa');
        } else {
          console.log('Sesión activa:', session.user.email);
        }
      } catch (error) {
        console.error('Error al verificar la sesión:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [location.pathname]); // Volver a verificar cuando cambie la ruta

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white">Verificando sesión...</div>
      </div>
    );
  }

  // Si no hay usuario, redirigir a la página de inicio de sesión
  if (!user) {
    console.log('Redirigiendo a login: No hay usuario autenticado');
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Si el usuario está autenticado, mostrar el componente hijo
  return <Outlet />;
};

export default ProtectedRoute;
