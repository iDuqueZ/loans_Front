import { createContext, useContext, useEffect, useState } from 'react';

const DebtContext = createContext();

export function DebtProvider({ children }) {
  const [debts, setDebts] = useState(() => {
    // Cargar estado inicial desde LocalStorage
    const savedDebts = localStorage.getItem('debts');
    return savedDebts ? JSON.parse(savedDebts) : [];
  });

  // Efecto para persistir en LocalStorage
  useEffect(() => {
    localStorage.setItem('debts', JSON.stringify(debts));
  }, [debts]);

  const addDebt = (newDebt) => {
    setDebts(prev => [...prev, { ...newDebt, id: Date.now() }]);
  };

  const updateDebt = (id, updatedDebt) => {
    setDebts(prev => prev.map(debt => 
      debt.id === id ? { 
        ...debt, 
        ...updatedDebt, 
        history: [...(debt.history || []), { 
          date: new Date(), 
          changes: updatedDebt 
        }] 
      } : debt
    ));
  };

  const deleteDebt = (id) => {
    setDebts(prev => prev.filter(debt => debt.id !== id));
  };

  return (
    <DebtContext.Provider value={{ 
      debts, 
      addDebt, 
      updateDebt,
      deleteDebt 
    }}>
      {children}
    </DebtContext.Provider>
  );
}

export const useDebt = () => useContext(DebtContext);