import { useQuery } from '@tanstack/react-query';
import { supabase } from './useSupabaseAuth';

export function usePendingDebts(userId) {
  return useQuery({
    queryKey: ['pendingDebts', userId],
    queryFn: async () => {
      // Obtener deudas donde el usuario es el acreedor (acreedor)
      const { data: creditorDebts, error: creditorError } = await supabase
        .from('debts')
        .select('*')
        .eq('acreedor_id', userId)
        .eq('estado', 'PENDIENTE')
        .order('fecha_creacion', { ascending: false });

      if (creditorError) throw creditorError;

      // Obtener deudas donde el usuario es el deudor
      const { data: debtorDebts, error: debtorError } = await supabase
        .from('debts')
        .select('*')
        .eq('deudor_id', userId)
        .eq('estado', 'PENDIENTE')
        .order('fecha_creacion', { ascending: false });

      if (debtorError) throw debtorError;

      // Combinar y ordenar las deudas
      const allDebts = [...(creditorDebts || []), ...(debtorDebts || [])];
      
      // Ordenar por fecha de creación (más recientes primero)
      return allDebts.sort((a, b) => 
        new Date(b.fecha_creacion) - new Date(a.fecha_creacion)
      );
    },
    enabled: !!userId,
    refetchOnWindowFocus: true,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
}
