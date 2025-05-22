import { useState } from 'react';
import { useDebt } from '../context/DebtContext';
import { format } from 'date-fns';
import { FaTimes } from 'react-icons/fa';

export default function DebtForm({ initialData, onClose, onSave }) {
  const { addDebt } = useDebt();
  const [formData, setFormData] = useState(initialData || {
    id: null,
    title: '',
    debtor: '',
    amount: '',
    interest: '',
    date: format(new Date(), 'yyyy-MM-dd')
  });


  const handleSubmit = (e) => {
    e.preventDefault();
    const newDebt = {
      ...formData,
      amount: Number(formData.amount),
      interest: formData.interest ? Number(formData.interest) : 0,
      date: new Date(formData.date)
    };
    
    if (initialData) {
      onSave(newDebt);
    } else {
      addDebt(newDebt);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-900/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Nueva Deuda</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
            
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título/resumen:
            </label>
            <input
              type="text"
              maxLength="50"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deudor:
            </label>
            <input
              type="text"
              required
              value={formData.debtor}
              onChange={(e) => setFormData({...formData, debtor: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monto ($):
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interés (%):
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={formData.interest}
              onChange={(e) => setFormData({...formData, interest: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha:
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Guardar Deuda
          </button>
        </form>
      </div>
    </div>
  );
}