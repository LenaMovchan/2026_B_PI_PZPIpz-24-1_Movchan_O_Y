import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute(): JSX.Element {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
