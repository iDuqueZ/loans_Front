import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import { supabase } from './hooks/useSupabaseAuth';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener la sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Escuchar cambios en el estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    // Limpiar la suscripción al desmontar
    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  // Página de autenticación
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Pagame Ve
            </h1>
            <p className="mt-2 text-gray-400">Gestiona tus préstamos de forma sencilla</p>
          </div>
          <Auth 
            supabaseClient={supabase} 
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#8b5cf6',
                    brandAccent: '#7c3aed',
                  },
                },
              },
            }}
            providers={['google', 'github']}
            theme="dark"
          />
        </div>
      </div>
    );
  }

  // Rutas protegidas cuando el usuario está autenticado
  return (
    <Routes>
      <Route 
        path="/" 
        element={<Navigate to="/home" replace />} 
      />
      
      <Route element={<ProtectedRoute user={session.user} />}>
        <Route path="/home" element={<Home user={session.user} />} />
        {/* Agrega aquí más rutas protegidas */}
      </Route>
      
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;