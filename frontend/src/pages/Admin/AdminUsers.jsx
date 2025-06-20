import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, promoteUserToAdmin, deleteUser } from '../../redux/slices/adminSlice';
import { logoutUser } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import {
  DocumentTextIcon,
  UsersIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmationModal from '../../components/ConfirmationModal';

const AdminUsers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading } = useSelector((state) => state.admin);
  const { isAuthenticated, role, user } = useSelector((state) => state.auth);

  const [search, setSearch] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return navigate('/login');
    if (role !== 'admin') return navigate('/user/dashboard');
    dispatch(fetchAllUsers());
  }, [dispatch, navigate, isAuthenticated, role]);

  const handlePromote = (id) => {
    dispatch(promoteUserToAdmin(id))
      .unwrap()
      .then(() => {
        toast.success('User promoted to admin successfully');
        dispatch(fetchAllUsers());
      })
      .catch((err) => toast.error(err.message || 'Failed to promote user'));
  };

  const handleDelete = (id) => {
    dispatch(deleteUser(id))
      .unwrap()
      .then(() => {
        toast.success('User deleted successfully');
        dispatch(fetchAllUsers());
        setIsDeleteModalOpen(false);
      })
      .catch((err) => toast.error(err.message || 'Failed to delete user'));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-gradient-to-b from-blue-800 to-indigo-900">
          <div className="flex items-center justify-center h-16 px-4 bg-blue-900">
            <h1 className="text-white text-xl font-bold">CivicWatch Admin</h1>
          </div>
          <div className="flex flex-col flex-grow px-4 py-8 overflow-y-auto">
            <div
              className="flex items-center mb-8 p-4 bg-blue-700 rounded-lg cursor-pointer hover:bg-blue-600 transition"
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
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-white bg-blue-700 rounded-lg"
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        </div>

        {/* Search Bar */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users by name or email..."
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* User Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        No users found matching your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {user.avatar ? (
                                <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.name} />
                              ) : (
                                <UserCircleIcon className="h-10 w-10 text-gray-400" />
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">
                                Joined {new Date(user.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {user.isVerified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            {user.role !== 'admin' && (
                              <button
                                onClick={() => handlePromote(user._id)}
                                className="text-indigo-600 hover:text-indigo-900 flex items-center"
                                title="Promote to Admin"
                              >
                                <ShieldCheckIcon className="h-4 w-4 mr-1" />
                                Promote
                              </button>
                            )}
          
                            <button
                              onClick={() => openDeleteModal(user)}
                              className="text-red-600 hover:text-red-900 flex items-center"
                              title="Delete User"
                            >
                              <TrashIcon className="h-4 w-4 mr-1" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => handleDelete(selectedUser?._id)}
        title="Confirm User Deletion"
        message={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
        confirmText="Delete User"
        cancelText="Cancel"
        danger={true}
      />
    </div>
  );
};

export default AdminUsers;
