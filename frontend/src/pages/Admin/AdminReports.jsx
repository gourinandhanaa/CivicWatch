import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllReports } from '../../redux/slices/adminSlice';
import { logoutUser } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import {
  DocumentTextIcon,
  UsersIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
  ChartBarIcon
} from '@heroicons/react/24/solid';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminReports = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { reports = [], loading, count = 0, error } = useSelector((state) => state.admin);
  const { isAuthenticated, role, user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (role !== 'admin') {
      navigate('/user/dashboard');
      return;
    }
    dispatch(fetchAllReports({ keyword: searchTerm, page }));
  }, [dispatch, navigate, isAuthenticated, role, searchTerm, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    dispatch(fetchAllReports({ keyword: searchTerm, page: 1 }));
  };

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
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-white bg-blue-700 rounded-lg"
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
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Manage Reports</h1>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6 flex items-center gap-4">
          <input
            type="text"
            placeholder="Search by title or pincode"
            className="w-full px-4 py-2 border rounded-lg shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            Search
          </button>
        </form>

        {/* Loading & Report Cards */}
        {loading ? (
          <LoadingSpinner size="lg" />
        ) : error ? (
          <p className="text-red-500 mb-4">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.length === 0 ? (
              <p className="text-gray-600">No reports found.</p>
            ) : (
              reports.map((report) => (
                <div key={report._id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center mb-2">
                    <DocumentTextIcon className="h-5 w-5 text-indigo-500 mr-2" />
                    <h3 className="font-semibold text-lg">{report.title}</h3>
                  </div>
                  <p className="text-sm text-gray-700">{report.description}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    📍 {report.location}, PIN: {report.pincode}
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    Severity: {report.severity}, Status: {report.status || 'Pending'}
                  </div>
                  <button
                    onClick={() => navigate(`/admin/reports/${report._id}`)}
                    className="mt-3 text-indigo-600 hover:underline text-sm"
                  >
                    View Details
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {count > 2 && (
          <div className="mt-6 flex justify-center gap-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              disabled={reports.length < 2}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReports;
