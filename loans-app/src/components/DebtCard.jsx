import { format } from 'date-fns';
import { FaUser, FaMoneyBillWave, FaCalendarAlt, FaPercentage } from 'react-icons/fa';

export default function DebtCard({ debt, onClick }) {
  const calculateTotal = () => {
    const interest = debt.interest ? debt.amount * (debt.interest / 100) : 0;
    return debt.amount + interest;
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(amount);
    
  }

  return (
    <div 
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-xl text-gray-800 truncate pr-2">{debt.title}</h3>
        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
          {format(new Date(debt.date), 'dd/MM/yyyy')}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center text-gray-600">
          <FaUser className="mr-2 text-blue-500" />
          <span className="font-medium text-gray-700">{debt.debtor}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <FaMoneyBillWave className="mr-2 text-blue-500" />
          <span>Monto: </span>
          <span className="ml-1 font-medium text-gray-800">{formatAmount(debt.amount)}</span>
        </div>
        
        {debt.interest && (
          <div className="flex items-center text-gray-600">
            <FaPercentage className="mr-2 text-blue-500" />
            <span>Interés: </span>
            <span className="ml-1 font-medium text-gray-800">{debt.interest}%</span>
          </div>
        )}
        
        <div className="pt-3 mt-3 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Total a pagar:</span>
            <span className="text-lg font-bold text-blue-600">{formatAmount(calculateTotal())}</span>
          </div>
        </div>
      </div>
    </div>
  );
}