import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/slices/authSlice';
import { Outlet } from 'react-router-dom';
import {
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  ChartBarIcon,
  ClipboardDocumentIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/solid';

const UserLayout = () => {
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
        <div className="flex flex-col w-64 bg-gradient-to-b from-indigo-800 to-purple-900">
          <div className="flex items-center justify-center h-16 px-4 bg-indigo-900">
            <h1 className="text-white text-xl font-bold">CivicWatch</h1>
          </div>
          <div className="flex flex-col flex-grow px-4 py-8 overflow-y-auto">
            {/* User Info */}
            <button
              onClick={() => navigate('/user/profile')}
              className="flex items-center mb-8 p-4 bg-indigo-700 rounded-lg w-full text-left hover:bg-indigo-600 transition"
            >
              <div className="flex-shrink-0">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="User Avatar"
                    className="h-12 w-12 rounded-full object-cover border-2 border-indigo-300"
                  />
                ) : (
                  <UserCircleIcon className="h-12 w-12 text-indigo-200" />
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">
                  {user?.name || 'User Name'}
                </p>
                <p className="text-xs font-medium text-indigo-200">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </button>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
              <button
                onClick={() => navigate('/user/dashboard')}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-indigo-200 hover:text-white hover:bg-indigo-600 rounded-lg transition"
              >
                <ChartBarIcon className="h-5 w-5 mr-3" />
                Dashboard
              </button>
              <button
                onClick={() => navigate('/user/my-reports')}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-indigo-200 hover:text-white hover:bg-indigo-600 rounded-lg transition"
              >
                <ClipboardDocumentIcon className="h-5 w-5 mr-3" />
                My Reports
              </button>
              <button
                onClick={() => navigate('/user/settings')}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-indigo-200 hover:text-white hover:bg-indigo-600 rounded-lg transition"
              >
                <Cog6ToothIcon className="h-5 w-5 mr-3" />
                Settings
              </button>
            </nav>

            {/* Logout */}
            <div className="mt-auto pt-4">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-indigo-200 hover:text-white hover:bg-indigo-600 rounded-lg transition"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content via React Router Outlet */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
