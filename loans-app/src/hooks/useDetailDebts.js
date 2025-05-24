import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './useSupabaseAuth';

export function useDetailDebts() {
  const queryClient = useQueryClient();

  // Buscar usuario por email
  const findUserByEmail = async (email) => {
    const { data: user, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (error || !user) {
      throw new Error('No se encontró un usuario con el correo electrónico proporcionado');
    }

    return user.id;
  };

  // Actualizar una deuda
  const updateDebt = useMutation({
    mutationFn: async ({ id, updates }) => {
      const { deudor_email, ...restUpdates } = updates;
      
      // Buscar el ID del usuario por email
      const deudor_id = await findUserByEmail(deudor_email);
      
      // Preparar los datos de actualización
      const updateData = {
        ...restUpdates,
        deudor_id,
        fecha_actualizacion: new Date().toISOString()
      };
      
      // Actualizar la deuda
      const { data, error } = await supabase
        .from('debts')
        .update(updateData)
        .eq('id', id)
        .select()
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      queryClient.invalidateQueries({ queryKey: ['pendingDebts'] });
    },
  });

  // Eliminar una deuda
  const deleteDebt = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('debts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      queryClient.invalidateQueries({ queryKey: ['pendingDebts'] });
    },
  });

  // Cambiar estado de la deuda
  const updateDebtStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      const { data, error } = await supabase
        .from('debts')
        .update({ estado: status })
        .eq('id', id)
        .select()
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      queryClient.invalidateQueries({ queryKey: ['pendingDebts'] });
    },
  });

  return {
    updateDebt,
    deleteDebt,
    updateDebtStatus,
  };
}
