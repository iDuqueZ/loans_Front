import { format } from 'date-fns';

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
      className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <h3 className="font-semibold text-lg text-gray-800">{debt.title}</h3>
      <p className="text-gray-600">Deudor: <span className="text-gray-800">{debt.debtor}</span></p>
      <p className="text-gray-600">Monto: <span className="text-gray-800">{formatAmount(debt.amount)}</span></p>
      {debt.interest && (
        <p className="text-gray-600">Interés: <span className="text-gray-800">{debt.interest}%</span></p>
      )}
      <p className="text-gray-600">Total: <span className="font-medium text-blue-800">{formatAmount(calculateTotal())}</span></p>
      <p className="text-gray-500 text-sm text-right">
        {format(new Date(debt.date), 'dd/MM/yyyy')}
      </p>
    </div>
  );
}