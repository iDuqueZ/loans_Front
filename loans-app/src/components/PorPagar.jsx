import PayList from './PayList';
import { memo } from 'react';

const PorPagarComponent = ({ user }) => {
    return (
        <div>
            {/* Barra superior */}
            <div className="container mx-auto items-center">
                <h1 className="text-2xl font-bold text-red-500">
                    Pagame Ve
                </h1>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-100 mb-2">Tus Deudas Por Pagar 💸</h2>
                <p className="text-gray-400">Revisa y gestiona las deudas que tienes pendientes de pago</p>
            </div>

            <div className="space-y-4">
                <PayList user={user} />
            </div>
        </div>
    );
};

// Usamos React.memo para memorizar el componente y evitar re-renderizados innecesarios
const PorPagar = memo(PorPagarComponent);

export default PorPagar;