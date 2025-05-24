import DebtList from './DebtList';
import FloatingButton from './FloatingButton';
import { useState, memo } from 'react';
import DebtForm from './DebtForm';

const PorCobrarComponent = ({ user }) => {
    const [showForm, setShowForm] = useState(false);

    return (
        <div>
            {/* Barra superior */}
            <div className="container mx-auto items-center">
                <h1 className="text-2xl font-bold text-green-500">
                    Pagame Ve
                </h1>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-100 mb-2">Tus Préstamos Por Cobrar 💵</h2>
                <p className="text-gray-400">Gestiona y realiza un seguimiento de tus préstamos</p>
            </div>

            <div className="space-y-4">
                <DebtList user={user} />
            </div>
            
            <FloatingButton 
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            />
            
            {showForm && (
                <DebtForm 
                    onClose={() => setShowForm(false)} 
                    className="bg-gray-800 border border-gray-700"
                />
            )}
        </div>
    );
};

// Usamos React.memo para memorizar el componente y evitar re-renderizados innecesarios
const PorCobrar = memo(PorCobrarComponent);

export default PorCobrar;