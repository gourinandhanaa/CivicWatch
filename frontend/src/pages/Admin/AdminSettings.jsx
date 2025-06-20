import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  DocumentTextIcon,
  UsersIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
  ChartBarIcon,
} from '@heroicons/react/24/solid';
import { logoutUser } from '../../redux/slices/authSlice';

const AdminSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

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
                <p className="text-sm font-medium text-white">{user?.name || 'Admin'}</p>
                <p className="text-xs font-medium text-blue-200">Administrator</p>
              </div>
            </div>

            <nav className="flex-1 space-y-2">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-blue-200 hover:text-white hover:bg-blue-600 rounded-lg transition"
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
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-white bg-blue-700 rounded-lg"
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
      <main className="flex-1 overflow-y-auto p-6 bg-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">🛠️ Admin Settings</h2>

            <div className="space-y-6">
              {/* Admin Account Settings */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h3>
                <div className="space-y-4">
                  <button
                    onClick={() => navigate('/change-password')}
                    className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Change Password</p>
                        <p className="text-sm text-gray-500">Update admin password</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Preferences */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Dark Mode</p>
                      <p className="text-sm text-gray-500">Toggle dark theme</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                      <span className="sr-only">Enable dark mode</span>
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1"></span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
