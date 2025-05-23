import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ user }) => {
  // Si no hay usuario, redirigir a la página de inicio de sesión
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Si el usuario está autenticado, mostrar el componente hijo
  return <Outlet />;
};

export default ProtectedRoute;
