import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout
import UserLayout from './pages/User/UserLayout';

// Public Pages
import Welcome from './pages/Welcome';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import VerifyEmail from './pages/Auth/VerifyEmail';
import NotAuthorized from './pages/NotAuthorized';

// Protected User Pages
import UserDashboard from './pages/User/Dashboard';
import ProfilePage from './pages/User/ProfilePage';
import Settings from './pages/Settings';
import MyReports from './pages/User/MyReports';
import NewReport from './pages/User/NewReport';

// Protected Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminReports from './pages/Admin/AdminReports';
import AdminReportDetails from './pages/Admin/AdminReportDetails';
import AdminProfilePage from './pages/Admin/AdminProfilePage';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminSettings from './pages/Admin/AdminSettings'; // ✅ Added AdminSettings

// Shared Protected Page
import ChangePassword from './pages/ChangePassword'; // ✅ Added ChangePassword

// Components
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRedirect from './components/RoleBasedRedirect';

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const authPages = ['/login', '/register', '/forgot-password'];
      if (authPages.includes(location.pathname)) {
        navigate(user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
      }
    }
  }, [isAuthenticated, user, location, navigate]);

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/not-authorized" element={<NotAuthorized />} />

        {/* Role-based Redirect */}
        <Route path="/dashboard" element={<RoleBasedRedirect />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/profile" element={<AdminProfilePage />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/reports/:id" element={<AdminReportDetails />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>

        {/* Protected User Routes (with User Layout) */}
        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route element={<UserLayout />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/profile" element={<ProfilePage />} />
            <Route path="/user/settings" element={<Settings />} />
            <Route path="/user/my-reports" element={<MyReports />} />
            <Route path="/user/new-report" element={<NewReport />} />
          </Route>
        </Route>

        {/* Shared route: Change Password for both roles */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'user']} />}>
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
