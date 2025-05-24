import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './useSupabaseAuth';

export function useSaveDebt() {
  const queryClient = useQueryClient();

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

  const saveDebt = useMutation({
    mutationFn: async (debtData) => {
      const { deudor_email, ...debt } = debtData;
      
      // Buscar el ID del usuario por email
      const deudor_id = await findUserByEmail(deudor_email);

      // Preparar los datos de la deuda
      const debtToSave = {
        ...debt,
        deudor_id,
        estado: 'PENDIENTE',
        valor: Number(debt.valor),
        interes: debt.interes ? Number(debt.interes) : 0,
        fecha_estimada_pago: debt.fecha_estimada_pago || null,
      };

      // Guardar la deuda
      const { data, error } = await supabase
        .from('debts')
        .insert(debtToSave)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidar consultas relevantes para actualizar la UI
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      queryClient.invalidateQueries({ queryKey: ['pendingDebts'] });
    },
  });

  return saveDebt;
}