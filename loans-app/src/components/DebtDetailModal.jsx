import { useDebt } from '../context/DebtContext';
import { format } from 'date-fns';
import { FaTimes } from 'react-icons/fa';
import { useState } from 'react';
import DebtForm from './DebtForm';

export default function DebtDetailModal({ debt, onClose }) {
  const { deleteDebt, updateDebt } = useDebt();
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = () => {
    if (window.confirm(`¿Seguro que quieres eliminar la deuda "${debt.title}"?`)) {
      deleteDebt(debt.id);
      onClose();
    }
  };

  if (isEditing) {
    return (
      <DebtForm
        initialData={debt}
        onClose={() => setIsEditing(false)}
        onSave={(updatedDebt) => {
          updateDebt(debt.id, updatedDebt);
          setIsEditing(false);
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-800 rounded-xl shadow-2xl w-full max-w-md border border-zinc-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/50 to-zinc-800/30" />
        
        <div className="relative z-10 p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-white">{debt.title}</h2>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white p-1 -mr-2 transition-colors"
              aria-label="Cerrar"
            >
              <FaTimes size={24} />
            </button>
          </div>
          
          <div className="space-y-4 mb-8">
            <div className="bg-zinc-700/50 p-4 rounded-lg border border-zinc-600/50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-zinc-400 mb-1">Deudor</p>
                  <p className="font-medium text-white">{debt.debtor}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-400 mb-1">Monto inicial</p>
                  <p className="font-medium text-white">${parseFloat(debt.amount).toLocaleString()}</p>
                </div>
                {debt.interest > 0 && (
                  <div>
                    <p className="text-sm text-zinc-400 mb-1">Tasa de interés</p>
                    <p className="font-medium text-white">{debt.interest}%</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-zinc-400 mb-1">Fecha de creación</p>
                  <p className="font-medium text-white">{format(new Date(debt.date), 'dd/MM/yyyy')}</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-zinc-600/50">
                <p className="text-sm text-zinc-400 mb-1">Total a pagar</p>
                <p className="text-xl font-bold text-green-400">
                  ${(debt.amount + (debt.amount * debt.interest / 100)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          {debt.history?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3">Historial de modificaciones</h3>
              <ul className="space-y-3">
                {debt.history.map((record, index) => (
                  <li 
                    key={index} 
                    className="relative pl-4 pb-3 border-l-2 border-green-500/30"
                  >
                    <div className="absolute w-3 h-3 rounded-full bg-green-500 -left-[7px] top-1" />
                    <p className="text-sm text-zinc-400">
                      {format(new Date(record.date), 'dd/MM/yyyy HH:mm')}
                    </p>
                    <p className="text-sm text-zinc-300">
                      Cambios en: <span className="text-white font-medium">{Object.keys(record.changes).join(', ')}</span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4 border-t border-zinc-700">
            <button
              onClick={handleDelete}
              className="px-5 py-2.5 bg-red-900/40 text-red-300 hover:bg-red-900/60 hover:text-white rounded-lg transition-all duration-200 border border-red-800/50 hover:border-red-700/50 flex items-center gap-2"
            >
              <span>Eliminar</span>
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="px-5 py-2.5 bg-green-900/30 text-green-300 hover:bg-green-900/50 hover:text-white rounded-lg transition-all duration-200 border border-green-800/50 hover:border-green-700/50 flex items-center gap-2"
            >
              <span>Modificar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}