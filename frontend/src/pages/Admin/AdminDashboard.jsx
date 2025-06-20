import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/slices/authSlice';
import { fetchAdminStats } from '../../redux/slices/adminSlice';
import {
  DocumentTextIcon,
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  UserCircleIcon
} from '@heroicons/react/24/solid';
import LoadingSpinner from '../../components/LoadingSpinner';
import DashboardCard from '../../components/DashboardCard';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { stats = {}, loading } = useSelector((state) => state.admin);
  const { isAuthenticated, role, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) return navigate('/login');
    if (role !== 'admin') return navigate('/user/dashboard');
    dispatch(fetchAdminStats());
  }, [dispatch, isAuthenticated, role, navigate]);

  const handleRefresh = () => dispatch(fetchAdminStats());

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-gradient-to-b from-blue-800 to-indigo-900">
          <div className="flex items-center justify-center h-16 px-4 bg-blue-900">
            <h1 className="text-white text-xl font-bold">CivicWatch Admin</h1>
          </div>
          <div className="flex flex-col flex-grow px-4 py-8 overflow-y-auto">
            <div
              className="flex items-center mb-8 p-4 bg-blue-700 rounded-lg cursor-pointer"
              onClick={() => navigate('/admin/profile')}
            >
              <div className="flex-shrink-0">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Admin Avatar"
                    className="h-12 w-12 rounded-full object-cover border-2 border-blue-300"
                  />
                ) : (
                  <UserCircleIcon className="h-12 w-12 text-blue-200" />
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">
                  {user?.name || 'Admin'}
                </p>
                <p className="text-xs font-medium text-blue-200">Administrator</p>
              </div>
            </div>

            <nav className="flex-1 space-y-2">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-white bg-blue-700 rounded-lg"
              >
                <ChartBarIcon className="h-5 w-5 mr-3" />
                Dashboard
              </button>
              <button
                onClick={() => navigate('/admin/reports')}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-blue-200 hover:text-white hover:bg-blue-600 rounded-lg transition"
              >
                <DocumentTextIcon className="h-5 w-5 mr-3" />
                Manage Reports
              </button>
              <button
                onClick={() => navigate('/admin/users')}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-blue-200 hover:text-white hover:bg-blue-600 rounded-lg transition"
              >
                <UsersIcon className="h-5 w-5 mr-3" />
                Manage Users
              </button>
              <button
                onClick={() => navigate('/admin/settings')}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-blue-200 hover:text-white hover:bg-blue-600 rounded-lg transition"
              >
                <Cog6ToothIcon className="h-5 w-5 mr-3" />
                System Settings
              </button>
            </nav>

            <div className="mt-auto pt-4">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-blue-200 hover:text-white hover:bg-blue-600 rounded-lg transition"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
          <button className="text-gray-500 focus:outline-none">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
          <UserCircleIcon className="h-8 w-8 text-gray-500" />
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Welcome, {user?.name?.split(' ')[0] || 'Admin'}! 👋
                </h2>
                <p className="text-gray-600 mt-1">
                  Here's what's happening with your system today
                </p>
              </div>
              <button
                onClick={handleRefresh}
                className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium shadow-sm border border-gray-200 transition flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <DashboardCard
                title="Total Users"
                value={stats.users || 0}
                icon={<UsersIcon className="h-8 w-8 text-blue-500" />}
                color="blue"
                trend={stats.newUsersThisWeek || 0}
                trendLabel="No. of Users"
              />
              <DashboardCard
                title="Total Reports"
                value={stats.reports || 0}
                icon={<DocumentTextIcon className="h-8 w-8 text-indigo-500" />}
                color="indigo"
                trend={stats.reportsTrend || 0}
                trendLabel="Total No. of reports"
              />
              <DashboardCard
                title="Pending Reports"
                value={stats.pendingReports || 0}
                icon={<ClockIcon className="h-8 w-8 text-amber-500" />}
                color="amber"
                trend={stats.pendingTrend || 0}
                trendLabel="No. of reports pending"
              />
              <DashboardCard
                title="Resolution Rate"
                value={`${stats.resolutionRate || 0}%`}
                icon={<CheckCircleIcon className="h-8 w-8 text-emerald-500" />}
                color="emerald"
                trend={stats.resolutionTrend || 0}
                trendLabel="improvement"
              />
            </div>

            {/* Recent Activity */}
            <div className="mt-12 bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {(stats.recentUsers || []).map((u, index) => (
                  <div key={`user-${index}`} className="flex items-start pb-4 border-b border-gray-100 last:border-0">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <UsersIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-800">
                        New user <strong>{u.name}</strong> registered
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(u.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                {(stats.recentReports || []).map((r, index) => (
                  <div key={`report-${index}`} className="flex items-start pb-4 border-b border-gray-100 last:border-0">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <DocumentTextIcon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-800">
                        New issue <strong>{r.title}</strong> reported
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(r.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
