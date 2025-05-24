import { format } from 'date-fns';
import { FaTimes, FaEdit, FaTrash, FaCheck, FaTimes as FaClose } from 'react-icons/fa';
import { useState } from 'react';
import { useDetailDebts } from '../hooks/useDetailDebts';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import DebtForm from './DebtForm';

export default function DebtDetailModal({ debt, onClose }) {
  const { user } = useSupabaseAuth();
  const { updateDebt, deleteDebt, updateDebtStatus } = useDetailDebts();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    if (window.confirm(`¿Seguro que quieres eliminar la deuda "${debt.concepto}"?`)) {
      try {
        setIsLoading(true);
        await deleteDebt.mutateAsync(debt.id);
        onClose();
      } catch (error) {
        console.error('Error al eliminar la deuda:', error);
        setError('Error al eliminar la deuda');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setIsLoading(true);
      await updateDebtStatus.mutateAsync({
        id: debt.id,
        status: newStatus
      });
      onClose();
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      setError('Error al actualizar el estado de la deuda');
    } finally {
      setIsLoading(false);
    }
  };

  const isCreditor = user?.id === debt.acreedor_id;
  const isDebtor = user?.id === debt.deudor_id;
  const isPending = debt.estado === 'PENDIENTE';

  if (isEditing) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
          <button
            onClick={() => setIsEditing(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <FaTimes size={24} />
          </button>
          <DebtForm
            initialData={debt}
            onClose={() => setIsEditing(false)}
            onSave={async (updatedDebt) => {
              try {
                setIsLoading(true);
                await updateDebt.mutateAsync({
                  id: debt.id,
                  updates: updatedDebt
                });
                onClose();
              } catch (error) {
                console.error('Error al actualizar la deuda:', error);
                setError('Error al actualizar la deuda');
              } finally {
                setIsLoading(false);
              }
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-800 rounded-xl shadow-2xl w-full max-w-md border border-zinc-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/50 to-zinc-800/30" />
        
        <div className="relative p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-white">{debt.concepto}</h2>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white p-1 -mr-2 transition-colors"
              disabled={isLoading}
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Estado */}
          <div className="mb-6">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              debt.estado === 'ACTIVA' ? 'bg-green-100 text-green-800' :
              debt.estado === 'CANCELADA' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {debt.estado}
            </div>
          </div>

          {/* Detalles */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-zinc-400">valor</span>
              <span className="text-xl font-bold text-white">
                ${debt.valor.toLocaleString()}
              </span>
            </div>
            
            {debt.interes > 0 && (
              <div className="flex justify-between">
                <span className="text-zinc-400">Interés</span>
                <span className="text-white">{debt.interes}%</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-zinc-400">Fecha de creación</span>
              <span className="text-white">
                {format(new Date(debt.fecha_creacion), 'PPP')}
              </span>
            </div>
            
            {debt.fecha_actualizacion && (
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Última actualización</span>
                <span className="text-zinc-400">
                  {format(new Date(debt.fecha_actualizacion), 'PPPp')}
                </span>
              </div>
            )}

            <div className="pt-4 border-t border-zinc-700">
              <p className="text-sm text-zinc-400 mb-1">
                {isCreditor ? 'Deudor' : 'Acreedor'}
              </p>
              <p className="font-medium text-white">
                {isCreditor ? debt.deudor_nombre : debt.acreedor_nombre}
              </p>
            </div>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-800 text-red-200 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Acciones */}
          <div className="flex flex-col space-y-3">
            {isPending && isDebtor && (
              <>
                <button
                  onClick={() => handleStatusUpdate('ACTIVA')}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors disabled:opacity-50 font-medium"
                >
                  <FaCheck /> Aceptar deuda
                </button>
                <button
                  onClick={() => handleStatusUpdate('CANCELADA')}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors disabled:opacity-50 font-medium"
                >
                  <FaClose /> Rechazar deuda
                </button>
              </>
            )}
            
            {isCreditor && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors disabled:opacity-50 font-medium"
                >
                  <FaEdit /> Editar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors disabled:opacity-50 font-medium"
                >
                  <FaTrash /> Eliminar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}