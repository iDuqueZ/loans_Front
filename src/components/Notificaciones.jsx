import NotiList from './NotiList';

function Notificaciones({ user }) {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-white mb-6">Solicitudes Pendientes</h1>
            <div className="p-6">
                <NotiList user={user} />
            </div>
        </div>
    );
}

export default Notificaciones;