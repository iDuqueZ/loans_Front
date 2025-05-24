import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import PayCard from './PayCard';
import DebtDetailModal from './DebtDetailModal';
import { useDebtsToPay } from '../hooks/useDebtsToPay';

export default function PayList({ user }) {
  const [selectedDebtId, setSelectedDebtId] = useState(null);
  const queryClient = useQueryClient();
  
  // Usar el hook useDebtsToPay para obtener las deudas a pagar
  const { 
    data: debts = [], 
    isLoading, 
    error, 
    refetch 
  } = useDebtsToPay(user?.id);

  // Obtener la deuda seleccionada
  const selectedDebt = debts.find(d => d.id === selectedDebtId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (error) {
    const message = error.message || 'Error al cargar las deudas por pagar';
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{message}</p>
            <div className="mt-2">
              <button
                onClick={() => refetch()}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (debts.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="max-w-md mx-auto p-6 rounded-lg">
          <svg className="w-16 h-16 mx-auto text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xl font-medium text-gray-200 mt-4">No tienes deudas por pagar</h3>
          <p className="text-gray-400">Aparecerán aquí cuando tengas deudas activas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {debts.map(debt => (
          <PayCard key={debt.id} debt={debt} onClick={() => setSelectedDebtId(debt.id)} />
        ))}
      </div>
      {selectedDebt && <DebtDetailModal debt={selectedDebt} onClose={() => setSelectedDebtId(null)} />}
    </div>
  );
}
