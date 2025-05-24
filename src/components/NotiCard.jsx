import { FaMoneyBillWave, FaPercentage, FaCheck, FaTimes } from 'react-icons/fa';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../hooks/useSupabaseAuth';

export default function NotiCard({ debt, onClick }) {
  const { user } = useSupabaseAuth();
  const queryClient = useQueryClient();

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateTotal = () => {
    const amount = parseFloat(debt.valor) || 0;
    const interest = (parseFloat(debt.interes) || 0) / 100;
    return amount + (amount * interest);
  };

  const updateDebtStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      const { data, error } = await supabase
        .from('debts')
        .update({ estado: status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingDebts'] });
      queryClient.invalidateQueries({ queryKey: ['debts'] });
    },
    onError: (error) => {
      console.error('Error al actualizar la deuda:', error);
    }
  });

  const handleStatusUpdate = async (status) => {
    try {
      await updateDebtStatus.mutateAsync({ id: debt.id, status });
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
    }
  };

  const isCurrentUserDebtor = user?.id === debt.deudor_id;
  const isUpdating = updateDebtStatus.isPending;

  return (
    <div 
      onClick={!isCurrentUserDebtor ? onClick : undefined}
      className={`relative p-4 rounded-lg shadow-md transition-all duration-200 cursor-pointer ${isCurrentUserDebtor ? 'border-2 border-orange-500' : 'border border-orange-400/30 hover:border-orange-500/50'}`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-white truncate">{debt.concepto}</h3>
      </div>
      
      <div className="space-y-2 mt-3">
        <div className="flex items-center text-orange-100">
          <FaMoneyBillWave className="mr-2 text-orange-400" />
          <span>Monto: </span>
          <span className="ml-1 font-medium text-white">{formatAmount(debt.valor)}</span>
        </div>
        
        {debt.interes > 0 && (
          <div className="flex items-center text-orange-100">
            <FaPercentage className="mr-2 text-orange-400" />
            <span>Interés: </span>
            <span className="ml-1 font-medium text-white">{debt.interes}%</span>
          </div>
        )}
        
        <div className="pt-3 mt-3 border-t border-orange-900/30">
          <div className="flex justify-between items-center">
            <span className="font-medium text-orange-100">Total a pagar:</span>
            <span className="text-lg font-bold text-orange-300">{formatAmount(calculateTotal())}</span>
          </div>
        </div>

        {isCurrentUserDebtor && (
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStatusUpdate('CANCELADA');
              }}
              disabled={isUpdating}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <FaTimes className="mr-1" />
              Rechazar
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStatusUpdate('ACTIVA');
              }}
              disabled={isUpdating}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <FaCheck className="mr-1" />
              Aceptar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
