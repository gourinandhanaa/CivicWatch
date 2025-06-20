import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const UserNavbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/user/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/reports', icon: '📋', label: 'My Reports' },
    { path: '/profile', icon: '👤', label: 'Profile' }
  ];

  return (
    <aside className="w-64 bg-white shadow h-screen fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-blue-600">CivicWatch</h1>
        <p className="text-sm text-gray-500">User Portal</p>
      </div>

      <nav className="mt-4">
        <ul className="flex flex-col gap-1 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default UserNavbar;
