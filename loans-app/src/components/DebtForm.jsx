import { useState } from 'react';
import { useDebt } from '../context/DebtContext';
import { format } from 'date-fns';
import { FaTimes } from 'react-icons/fa';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';

export default function DebtForm({ initialData, onClose, onSave }) {
  const { addNewDebt } = useDebt();
  const { user } = useSupabaseAuth();
  const [formData, setFormData] = useState(initialData || {
    concepto: '',
    deudor_email: '',
    valor: '',
    interes: 0,
    fecha_estimada_pago: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), // 30 days from now
    estado: 'PENDIENTE'
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      // Validate required fields
      if (!formData.concepto || !formData.deudor_email || !formData.valor) {
        throw new Error('Por favor completa todos los campos obligatorios');
      }

      const newDebt = {
        concepto: formData.concepto,
        acreedor_id: user.id, // Current user is the creditor
        deudor_id: formData.deudor_id,
        valor: Number(formData.valor),
        interes: formData.interes ? Number(formData.interes) : 0,
        fecha_estimada_pago: formData.fecha_estimada_pago || null,
        estado: 'PENDIENTE'
      };
      
      if (initialData) {
        await onSave(newDebt);
      } else {
        await addNewDebt(newDebt);
        onClose();
      }
    } catch (error) {
      console.error('Error al guardar la deuda:', error);
      setError(error.message || 'Error al guardar la deuda');
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-900/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? 'Editar Deuda' : 'Nueva Deuda'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Concepto *
            </label>
            <input
              type="text"
              maxLength="100"
              required
              value={formData.concepto}
              onChange={(e) => setFormData({...formData, concepto: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej. Préstamo personal, Pago de servicios, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email del Deudor *
            </label>
            <input
              type="email"
              required
              value={formData.deudor_email}
              onChange={(e) => setFormData({...formData, deudor_email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingresa el email del deudor"
            />
            <p className="text-xs text-gray-500 mt-1">
              * El acreedor eres tú (ID: {user?.id || 'No disponible'})
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor ($) *
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={formData.valor}
                  onChange={(e) => setFormData({...formData, valor: e.target.value})}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interés (%)
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.interes}
                  onChange={(e) => setFormData({...formData, interes: e.target.value})}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.0"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm" id="price-currency">%</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha estimada de pago
            </label>
            <input
              type="date"
              value={formData.fecha_estimada_pago}
              min={format(new Date(), 'yyyy-MM-dd')}
              onChange={(e) => setFormData({...formData, fecha_estimada_pago: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Dejar en blanco si no hay fecha estimada
            </p>
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