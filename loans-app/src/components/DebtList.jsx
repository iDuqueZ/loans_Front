import { useState } from 'react';
import { useDebt } from '../context/DebtContext';
import DebtCard from './DebtCard';
import DebtDetailModal from './DebtDetailModal';

export default function DebtList() {
  const { debts } = useDebt();
 const [selectedDebtId, setSelectedDebtId] = useState(null);

  const selectedDebt = debts.find(debt => debt.id === selectedDebtId);

  console.log(selectedDebt);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {debts.map(debt => (
        <DebtCard 
          key={debt.id} 
          debt={debt}
          onClick={() => setSelectedDebtId(debt.id)}
        />
      ))}
      
      {selectedDebt && (
        <DebtDetailModal 
          debt={selectedDebt}
          onClose={() => setSelectedDebtId(null)}
        />
      )}
    </div>
  );
}