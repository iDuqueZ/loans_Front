import { useQuery } from '@tanstack/react-query';
import { supabase } from './useSupabaseAuth';

export function useDebts(userId) {
  return useQuery({
    queryKey: ['debts', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('debts')
        .select('*')
        .eq('acreedor_id', userId)
        .eq('estado', 'ACTIVA')
        .order('fecha_creacion', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,          // Solo si existe userId
    refetchOnWindowFocus: true, // Recarga al volver de pestaña
    retry: 1,                   // Un intento de reintento
    staleTime: 5 * 60 * 1000,   // 5 minutos de tiempo de caché
  });
}
