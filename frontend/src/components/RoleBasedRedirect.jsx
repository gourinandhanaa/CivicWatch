import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingSpinner from './LoadingSpinner';

const RoleBasedRedirect = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  // While checking auth status
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Role-based redirect
  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'user':
      return <Navigate to="/user/dashboard" replace />;
    default:
      return <Navigate to="/not-authorized" replace />;
  }
};

export default RoleBasedRedirect;
