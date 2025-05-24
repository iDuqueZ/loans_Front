import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { FaTimes } from 'react-icons/fa';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import { useSaveDebt } from '../hooks/useSaveDebt';

export default function DebtForm({ initialData, onClose, onSave }) {
  const { user } = useSupabaseAuth();
  const [formData, setFormData] = useState(initialData || {
    concepto: '',
    deudor_email: '',
    valor: '',
    interes: 0,
    fecha_estimada_pago: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd') // 30 days from now
  });
  const [error, setError] = useState(null);

  const { mutate: saveDebt, isLoading } = useSaveDebt();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      // Validate required fields
      if (!formData.concepto || !formData.deudor_email || !formData.valor) {
        throw new Error('Por favor completa todos los campos obligatorios');
      }

      console.log(user.id);
      const newDebt = {
        concepto: formData.concepto,
        valor: formData.valor,
        interes: formData.interes,
        fecha_estimada_pago: formData.fecha_estimada_pago,
        acreedor_id: user.id,
        deudor_email: formData.deudor_email
      };
      
      if (initialData && onSave) {
        await onSave(newDebt);
        onClose();
      } else {
        saveDebt(newDebt, {
          onSuccess: () => onClose(),
          onError: (error) => {
            console.error('Error al guardar la deuda:', error);
            setError(error.message || 'Error al guardar la deuda');
          }
        });
      }
    } catch (error) {
      console.error('Error al guardar la deuda:', error);
      setError(error.message || 'Error al guardar la deuda');
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-900/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-800 rounded-xl shadow-2xl w-full max-w-md p-6 border border-zinc-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-zinc-100">
            {initialData ? 'Editar Deuda' : 'Nueva Deuda'}
          </h2>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200 transition-colors"
            aria-label="Cerrar"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-200 px-4 py-3 rounded-lg relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
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
            <label className="block text-sm font-medium text-gray-300 mb-1">
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
              <label className="block text-sm font-medium text-zinc-400 mb-1">
                Valor ($) *
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-zinc-400 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={formData.valor}
                  onChange={(e) => setFormData({...formData, valor: e.target.value})}
                  className="focus:outline-emerald-500 focus:border-emerald-500 block w-full pl-7 pr-12 px-3 py-2 sm:text-sm border-zinc-600 rounded-lg bg-zinc-700 text-zinc-100 placeholder-zinc-400"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
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
                  className="appearance-none focus:outline-emerald-500 focus:border-emerald-500 block w-full pr-12 px-3 py-2 sm:text-sm border-zinc-600 rounded-lg bg-zinc-700 text-zinc-100 placeholder-zinc-400"
                  placeholder="0.0"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-zinc-400 sm:text-sm" id="price-currency">%</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
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
            disabled={isLoading}
            className={`w-full ${isLoading ? 'bg-emerald-600' : 'bg-emerald-600 hover:bg-emerald-700'} text-white py-2.5 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-800 font-medium`}
          >
            {isLoading ? 'Guardando...' : 'Guardar Deuda'}
          </button>
        </form>
      </div>
    </div>
  );
}