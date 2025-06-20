import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { loadUser } from '../redux/slices/authSlice';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ allowedRoles, redirectPath = '/login' }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { isAuthenticated, user, role, isLoading } = useSelector((state) => state.auth);

  // ✅ Attempt to load user if not already authenticated
  useEffect(() => {
    if (!isAuthenticated && localStorage.getItem('token')) {
      dispatch(loadUser());
    }
  }, [dispatch, isAuthenticated]);

  // 🔄 Show loading spinner during auth check
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner centered />
      </div>
    );
  }

  // ❌ Not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // 🚫 Role mismatch
  if (allowedRoles && user) {
    const hasAccess = allowedRoles.includes(user.role);
    if (!hasAccess) {
      const fallback = user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
      return <Navigate to={fallback} replace />;
    }
  }

  // ✅ Authorized
  return <Outlet />;
};

export default ProtectedRoute;
