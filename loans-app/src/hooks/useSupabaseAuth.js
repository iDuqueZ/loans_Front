import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Inicializar el cliente de Supabase (singleton)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,    // Guarda la sesión en localStorage
    autoRefreshToken: true,  // Refresca el token automáticamente
    detectSessionInUrl: false // Evita lecturas de URL en OAuth callbacks
  }
});

/**
 * Hook personalizado para manejar autenticación con Supabase
 */
export function useSupabaseAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar y crear usuario en la tabla "users" si no existe
  const checkAndCreateUser = async (user) => {
    if (!user) return;
    try {
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id);

      if (!fetchError && existingUser.length === 0) {
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert([{ id: user.id, email: user.email }])
          .select();

        if (createError) {
          console.error('Error al crear usuario:', createError);
        } else {
          console.log('Usuario creado:', newUser);
        }
      }
    } catch (error) {
      console.error('Error en checkAndCreateUser:', error);
    }
  };

  useEffect(() => {
    // Cargar la sesión inicial antes de suscribir al listener
    (async () => {
      try {
        const {
          data: { session }
        } = await supabase.auth.getSession();
        if (session?.user) {
          await checkAndCreateUser(session.user);
          setUser(session.user);
        }
      } catch (error) {
        console.error('Error al obtener sesión inicial:', error);
      } finally {
        setLoading(false);
      }
    })();

    // Listener de cambios de auth (INITIAL_SESSION, SIGNED_IN y SIGNED_OUT)
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[Auth event]', event, session);
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
        const current = session.user;
        await checkAndCreateUser(current);
        setUser(current);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      // Ignorar otros eventos como TOKEN_REFRESHED, USER_UPDATED
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Métodos de autenticación
  const signInWithEmail = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  };

  const signUpWithEmail = async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error al cerrar sesión:', error);
    setUser(null);
  };

  return { supabase, user, loading, signInWithEmail, signUpWithEmail, signOut };
}

export default useSupabaseAuth;
