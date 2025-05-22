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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-4">{debt.title}</h2>
        
        <div className="space-y-3 mb-6">
          <p><span className="font-medium">Deudor:</span> {debt.debtor}</p>
          <p><span className="font-medium">Monto inicial:</span> ${debt.amount}</p>
          {debt.interest > 0 && (
            <p><span className="font-medium">Interés:</span> {debt.interest}%</p>
          )}
          <p className="text-lg font-semibold">
            <span className="font-medium">Total a pagar:</span> ${(debt.amount + (debt.amount * debt.interest / 100)).toFixed(2)}
          </p>
          <p><span className="font-medium">Fecha de creación:</span> {format(new Date(debt.date), 'dd/MM/yyyy')}</p>
        </div>

        {debt.history?.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium mb-2">Historial de modificaciones:</h3>
            <ul className="space-y-2 text-sm">
              {debt.history.map((record, index) => (
                <li key={index} className="border-l-4 border-blue-200 pl-2">
                  {format(new Date(record.date), 'dd/MM/yyyy HH:mm')} - 
                  Cambios en: {Object.keys(record.changes).join(', ')}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Eliminar
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Modificar
          </button>
        </div>
      </div>
    </div>
  );
}