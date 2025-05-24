import { useState } from 'react';
import DebtDetailModal from './DebtDetailModal';
import { usePendingDebts } from '../hooks/usePendingDebts';
import NotiCard from './NotiCard';
import { useQueryClient } from '@tanstack/react-query';

export default function NotiList({ user }) {
  const [selectedDebtId, setSelectedDebtId] = useState(null);
  const queryClient = useQueryClient();
  
  // Usar el hook usePendingDebts para obtener las deudas pendientes
  const { 
    data: pendingDebts = [], 
    isLoading, 
    error, 
    refetch 
  } = usePendingDebts(user?.id);

  // Obtener la deuda seleccionada
  const selectedDebt = pendingDebts.find(d => d.id === selectedDebtId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (error) {
    const message = error.message || 'Error al cargar las notificaciones';
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

  if (pendingDebts.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="max-w-md mx-auto p-6 rounded-lg">
          <svg className="w-16 h-16 mx-auto text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <h3 className="text-xl font-medium text-gray-200 mt-4">No tienes notificaciones</h3>
          <p className="text-gray-400">Aparecerán aquí cuando tengas solicitudes pendientes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {pendingDebts.map(debt => (
          <NotiCard 
            key={debt.id} 
            debt={debt} 
            onClick={() => setSelectedDebtId(debt.id)} 
          />
        ))}
      </div>
      {selectedDebt && <DebtDetailModal debt={selectedDebt} onClose={() => setSelectedDebtId(null)} />}
    </div>
  );
}
