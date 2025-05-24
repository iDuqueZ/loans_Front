import { createContext, useContext, useState, useCallback } from 'react';
import { supabase } from '../hooks/useSupabaseAuth';

const DebtContext = createContext();

export function DebtProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para agregar timeout a una promesa
  const withTimeout = (promise, timeoutMs = 10000) => {
    return Promise.race([
      promise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Tiempo de espera agotado al consultar la base de datos')), timeoutMs)
      )
    ]);
  };

  // Obtener deudas activas donde el usuario es el acreedor (por cobrar)
  const getActiveDebtsToReceive = useCallback(async (userId) => {
    console.log('🔍 [DebtContext] getActiveDebtsToReceive iniciado para userId:', userId);
    if (!userId) {
      console.log('❌ [DebtContext] userId no proporcionado');
      return [];
    }
    
    try {
      console.log('⏳ [DebtContext] Estableciendo loading a true');
      setLoading(true);
      setError(null);

      console.log('📡 [DebtContext] Realizando consulta a Supabase...');
      
      // Crear la consulta
      const query = supabase
        .from('debts')
        .select('*')
        .eq('acreedor_id', userId)
        .eq('estado', 'ACTIVA')
        .order('fecha_creacion', { ascending: false });

      // Ejecutar la consulta con timeout
      const { data, error } = await withTimeout(query, 10000);

      console.log('📊 [DebtContext] Respuesta de Supabase:', { data, error });

      if (error) {
        console.error('❌ [DebtContext] Error en la consulta:', error);
        throw error;
      }
      
      const result = data || [];
      console.log(`✅ [DebtContext] Deudas encontradas: ${result.length}`);
      return result;
    } catch (error) {
      console.error('❌ [DebtContext] Error al obtener deudas por cobrar:', error);
      setError(error.message || 'Error al cargar las deudas');
      return [];
    } finally {
      console.log('🏁 [DebtContext] Finalizando operación, estableciendo loading a false');
      setLoading(false);
    }
  }, []);

  // Obtener deudas activas donde el usuario es el deudor (por pagar)
  const getActiveDebtsToPay = useCallback(async (userId) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('debts')
        .select('*, users:acreedor_id(*)')
        .eq('deudor_id', userId)
        .eq('estado', 'ACTIVA')
        .order('fecha_creacion', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al obtener deudas por pagar:', error);
      setError(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear una nueva deuda
  const addNewDebt = useCallback(async (debtData) => {
    try {
      setLoading(true);
      
      // Primero buscamos el ID del usuario por su email
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', debtData.deudor_email)

      if (userError || !userData) {
        throw new Error('No se encontró ningún usuario con el email proporcionado');
      }

      // Creamos la deuda con el ID del usuario encontrado
      const { data, error } = await supabase
        .from('debts')
        .insert([
          {
            ...debtData,
            deudor_id: userData.id, // Usamos el ID encontrado
            estado: 'ACTIVA', // Por defecto la deuda se crea como ACTIVA
          }
        ])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error al crear la deuda:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar una deuda existente
  const updateDebt = useCallback(async (debtId, updates) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('debts')
        .update(updates)
        .eq('id', debtId)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error al actualizar la deuda:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Marcar una deuda como pagada
  const markAsPaid = useCallback(async (debtId) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('debts')
        .update({ estado: 'PAGADA', fecha_pago: new Date().toISOString() })
        .eq('id', debtId)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error al marcar como pagada:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <DebtContext.Provider value={{ 
      loading,
      error,
      getActiveDebtsToReceive,
      getActiveDebtsToPay,
      addNewDebt,
      updateDebt,
      markAsPaid,
      clearError: () => setError(null)
    }}>
      {children}
    </DebtContext.Provider>
  );
}

export const useDebt = () => {
  const context = useContext(DebtContext);
  if (context === undefined) {
    throw new Error('useDebt debe usarse dentro de un DebtProvider');
  }
  return context;
};