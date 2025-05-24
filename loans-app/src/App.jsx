import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './components/Home';
import PorCobrar from './components/PorCobrar';
import PorPagar from './components/PorPagar';
import Notificaciones from './components/Notificaciones';
import ProtectedRoute from './components/ProtectedRoute';
import NavBar from './components/NavBar';
import { supabase } from './hooks/useSupabaseAuth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
});

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Efecto para manejar la autenticación
  useEffect(() => {
    let mounted = true;
    
    // Función para obtener la sesión actual
    const getInitialSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (mounted) {
          setSession(currentSession);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error al obtener la sesión inicial:', error);
        if (mounted) {
          setSession(null);
          setLoading(false);
        }
      }
    };

    // Obtener la sesión inicial
    getInitialSession();

    // Suscribirse a cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Evento de autenticación:', event);
        console.log('Nueva sesión:', newSession);
        
        if (mounted) {
          setSession(newSession);
          setLoading(false);
        }
      }
    );

    // Limpiar suscripción al desmontar
    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }
  
  console.log('Estado de la sesión:', session ? 'Autenticado' : 'No autenticado');

  // Página de autenticación
  if (!session) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
          <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Pagame Vé
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
              onlyThirdPartyProviders={false}
              view="sign_in"
              redirectTo={window.location.origin}
            />
          </div>
        </div>
      </QueryClientProvider>
    );
  }

  // Layout component that includes the NavBar and content
  const Layout = () => (
    <div className="flex h-screen bg-zinc-600">
      <NavBar />
      <main className="flex-1 overflow-y-auto p-6 ml-18 transition-all duration-300 ease-in-out bg-zinc-800">
        <Outlet />
      </main>
    </div>
  );

  // Rutas protegidas cuando el usuario está autenticado
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route element={<ProtectedRoute user={session.user} />}>
          <Route element={<Layout />}>
            <Route path="/home" element={<Home user={session.user} />} />
            <Route path="/porcobrar" element={<PorCobrar user={session.user} />} />
            <Route path="/porpagar" element={<PorPagar user={session.user} />} />
            <Route path="/notificaciones" element={<Notificaciones user={session.user} />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;