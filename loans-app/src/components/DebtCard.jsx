import { format } from 'date-fns';
import { FaUser, FaMoneyBillWave, FaCalendarAlt, FaPercentage } from 'react-icons/fa';

export default function DebtCard({ debt, onClick }) {
  const calculateTotal = () => {
    const interest = debt.interes ? debt.valor * (debt.interes / 100) : 0;
    return debt.valor + interest;
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(amount);
    
  }

  return (
    <div 
      className="bg-zinc-800 rounded-xl shadow-lg p-6 border border-zinc-700 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:border-zinc-600"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-xl text-white truncate pr-2">{debt.concepto}</h3>
        <span className="px-3 py-1 bg-green-900/30 text-green-400 text-sm font-medium rounded-full border border-green-800/50">
          {format(new Date(debt.fecha_creacion), 'dd/MM/yyyy')}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center text-zinc-300">
          <FaUser className="mr-2 text-green-500" />
          <span className="font-medium text-white">{debt.deudor}</span>
        </div>
        
        <div className="flex items-center text-zinc-300">
          <FaMoneyBillWave className="mr-2 text-green-500" />
          <span>Monto: </span>
          <span className="ml-1 font-medium text-white">{formatAmount(debt.valor)}</span>
        </div>
        
        {debt.interes && (
          <div className="flex items-center text-zinc-300">
            <FaPercentage className="mr-2 text-green-500" />
            <span>Interés: </span>
            <span className="ml-1 font-medium text-white">{debt.interes}</span>
          </div>
        )}
        
        <div className="pt-3 mt-3 border-t border-zinc-700">
          <div className="flex justify-between items-center">
            <span className="font-medium text-zinc-300">Total a pagar:</span>
            <span className="text-lg font-bold text-green-400">{formatAmount( calculateTotal())}</span>
          </div>
        </div>
      </div>
    </div>
  );
}