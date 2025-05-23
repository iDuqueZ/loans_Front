import { DebtProvider } from '../context/DebtContext';
import DebtList from './DebtList';
import FloatingButton from './FloatingButton';
import { useState } from 'react';
import DebtForm from './DebtForm';
import { SignedIn, UserButton } from '@clerk/clerk-react';

function Home() {
    const [showForm, setShowForm] = useState(false);
    
    return (
        <section>
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
        <SignedIn>
              <div className="mt-4">
                <UserButton 
                  appearance={{
                    elements: {
                      userButtonBox: "mx-auto",
                      userButtonAvatarBox: "h-12 w-12"
                    }
                  }}
                />
              </div>
        </SignedIn>
        </section>
    );
}

export default Home;
