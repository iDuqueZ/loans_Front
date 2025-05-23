import { DebtProvider } from '../context/DebtContext';
import DebtList from './DebtList';
import FloatingButton from './FloatingButton';
import { useState } from 'react';
import DebtForm from './DebtForm';
import { supabase } from '../hooks/useSupabaseAuth';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 pb-12">
            {/* Barra superior */}
            <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                        Pagame Ve
                    </h1>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={async () => {
                                await supabase.auth.signOut();
                                navigate('/');
                            }}
                            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
                        >
                            <span>Cerrar sesión</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h7v-2H4V6h6V4H3zm12.707 5.707a1 1 0 00-1.414-1.414L14 10.586l-1.293-1.293a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Contenido principal */}
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-100 mb-2">Tus Préstamos</h2>
                    <p className="text-gray-400">Gestiona y realiza un seguimiento de tus préstamos</p>
                </div>

                <DebtProvider>
                    <div className="space-y-4">
                        <DebtList />
                    </div>
                    
                    <FloatingButton 
                        onClick={() => setShowForm(true)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    />
                    
                    {showForm && (
                        <DebtForm 
                            onClose={() => setShowForm(false)} 
                            className="bg-gray-800 border border-gray-700"
                        />
                    )}
                </DebtProvider>
            </main>
        </div>
    );
}

export default Home;