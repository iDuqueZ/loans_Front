import { useState, useEffect, useCallback } from 'react';
import { supabase } from './useSupabaseAuth';

/**
 * Hook personalizado para obtener el usuario actual de Supabase
 * sin la lógica adicional de creación de usuarios.
 * 
 * @returns {Object} Objeto con el usuario actual y estado de carga
 * @property {Object|null} user - Usuario actual de Supabase o null si no está autenticado
 * @property {boolean} loading - Indica si se está cargando la información del usuario
 */
export function useSupabaseUser() {
  const [state, setState] = useState({
    user: null,
    loading: true
  });

  const handleAuthChange = useCallback(async (event, session) => {
    console.log('Auth state changed:', event, session?.user?.id);
    setState(prev => ({
      user: session?.user ?? null,
      loading: false
    }));
  }, []);

  useEffect(() => {
    let mounted = true;
    
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('Session data:', { session, error });
        
        if (error) {
          console.error('Error getting session:', error);
          throw error;
        }
        
        if (mounted) {
          console.log('Setting initial user:', session?.user?.id);
          setState({
            user: session?.user ?? null,
            loading: false
          });
        }
      } catch (error) {
        console.error('Error en getInitialSession:', error);
        if (mounted) {
          setState({
            user: null,
            loading: false
          });
        }
      }
    };

    getInitialSession();

    // Escuchar cambios en el estado de autenticación
    console.log('Setting up auth state listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed in listener:', event);
        handleAuthChange(event, session);
      }
    );

    // Limpiar la suscripción al desmontar el componente
    return () => {
      console.log('Cleaning up auth listener');
      mounted = false;
      if (subscription?.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, [handleAuthChange]);

  console.log('Current user state:', { 
    userId: state.user?.id, 
    loading: state.loading 
  });

  return { 
    user: state.user, 
    loading: state.loading 
  };
}

export default useSupabaseUser;
