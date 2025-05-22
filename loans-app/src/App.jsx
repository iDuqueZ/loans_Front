import { DebtProvider } from './context/DebtContext';
import DebtList from './components/DebtList';
import FloatingButton from './components/FloatingButton';
import { useState } from 'react';
import DebtForm from './components/DebtForm';

function App() {
  const [showForm, setShowForm] = useState(false);

  return (
    <DebtProvider>
      <div className="container mx-auto p-6 mt-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-200 mb-6">Pagame Ve</h1>
        <div className="grid gap-4">
          <DebtList />
        </div>
        <FloatingButton onClick={() => setShowForm(true)} />
        {showForm && <DebtForm onClose={() => setShowForm(false)} />}
      </div>
    </DebtProvider>
  );
}

export default App;