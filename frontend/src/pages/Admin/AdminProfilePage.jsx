import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  UserCircleIcon,
  PencilIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  CalendarIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  DocumentTextIcon,
  UsersIcon,
  XMarkIcon,
  CheckIcon,
  PhotoIcon,
} from '@heroicons/react/24/solid';
import LoadingSpinner from '../../components/LoadingSpinner';
import { updateProfile, loadUser } from '../../redux/slices/authSlice';

const AdminProfilePage = () => {
  const { user, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
      setAvatarPreview(user.avatar || '');
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
      setAvatarFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('email', formData.email);
    if (avatarFile) payload.append('avatar', avatarFile);

    const result = await dispatch(updateProfile(payload));
    if (updateProfile.fulfilled.match(result)) {
      dispatch(loadUser());
      setIsEditing(false);
    } else {
      console.error('❌ Profile update failed:', result.payload);
    }
  };

  if (!user) return <LoadingSpinner size="lg" />;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-gradient-to-b from-blue-800 to-indigo-900">
          <div className="flex items-center justify-center h-16 px-4 bg-blue-900">
            <h1 className="text-white text-xl font-bold">CivicWatch Admin</h1>
          </div>
          <div className="flex flex-col flex-grow px-4 py-8 overflow-y-auto">
            <div className="flex items-center mb-8 p-4 bg-blue-700 rounded-lg">
              <div className="flex-shrink-0">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Admin Avatar"
                    className="h-12 w-12 rounded-full object-cover border-2 border-white"
                  />
                ) : (
                  <UserCircleIcon className="h-12 w-12 text-blue-200" />
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs font-medium text-blue-200">Administrator</p>
              </div>
            </div>

            <nav className="flex-1 space-y-2">
              <button onClick={() => navigate('/admin/dashboard')} className="flex items-center w-full px-4 py-3 text-sm font-medium text-white bg-blue-700 rounded-lg">
                <ShieldCheckIcon className="h-5 w-5 mr-3" />
                Dashboard
              </button>
              <button onClick={() => navigate('/admin/reports')} className="flex items-center w-full px-4 py-3 text-sm font-medium text-blue-200 hover:text-white hover:bg-blue-600 rounded-lg transition">
                <DocumentTextIcon className="h-5 w-5 mr-3" />
                Manage Reports
              </button>
              <button onClick={() => navigate('/admin/users')} className="flex items-center w-full px-4 py-3 text-sm font-medium text-blue-200 hover:text-white hover:bg-blue-600 rounded-lg transition">
                <UsersIcon className="h-5 w-5 mr-3" />
                Manage Users
              </button>
              <button onClick={() => navigate('/admin/settings')} className="flex items-center w-full px-4 py-3 text-sm font-medium text-blue-200 hover:text-white hover:bg-blue-600 rounded-lg transition">
                <Cog6ToothIcon className="h-5 w-5 mr-3" />
                System Settings
              </button>
            </nav>

            <div className="mt-auto pt-4">
              <button onClick={() => navigate('/login')} className="flex items-center w-full px-4 py-3 text-sm font-medium text-blue-200 hover:text-white hover:bg-blue-600 rounded-lg transition">
                <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-800 to-indigo-900 p-6 text-white">
              <div className="flex items-center">
                <div className="flex-shrink-0 relative">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Admin" className="h-20 w-20 rounded-full object-cover border-4 border-white" />
                  ) : (
                    <UserCircleIcon className="h-20 w-20 text-white" />
                  )}
                  {isEditing && (
                    <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow">
                      <label htmlFor="avatar-upload" className="cursor-pointer">
                        <PhotoIcon className="h-5 w-5 text-indigo-600" />
                        <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                      </label>
                    </div>
                  )}
                </div>
                <div className="ml-6">
                  {isEditing ? (
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="text-2xl font-bold bg-transparent border-b border-white focus:outline-none" />
                  ) : (
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                  )}
                  <p className="text-indigo-100">{user.email}</p>
                  <div className="mt-2 flex items-center">
                    <ShieldCheckIcon className="h-5 w-5 mr-1" />
                    <span className="text-sm">Administrator</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-gray-800">Profile Information</h1>
                {isEditing ? (
                  <div className="flex space-x-2">
                    <button onClick={() => setIsEditing(false)} className="flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                      <XMarkIcon className="h-4 w-4 mr-1" />
                      Cancel
                    </button>
                    <button onClick={handleSubmit} disabled={isLoading} className="flex items-center px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50">
                      {isLoading ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-1" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckIcon className="h-4 w-4 mr-1" />
                          Save
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="flex items-center px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Edit Profile
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-5 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <UserIcon className="h-5 w-5 mr-2 text-indigo-500" />
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      {isEditing ? (
                        <input name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
                      ) : (
                        <p className="font-medium">{user.name}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      {isEditing ? (
                        <input name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
                      ) : (
                        <p className="font-medium">{user.email}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Account Status</p>
                      <p className="font-medium flex items-center">
                        {user.isVerified ? (
                          <>
                            <span className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                            Verified
                          </>
                        ) : (
                          <>
                            <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2" />
                            Unverified
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Cog6ToothIcon className="h-5 w-5 mr-2 text-indigo-500" />
                    Account Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Admin Since</p>
                      <p className="font-medium flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email Status</p>
                      <p className="font-medium flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-1" />
                        {user.isVerified ? 'Verified' : 'Not Verified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Account Role</p>
                      <p className="font-medium flex items-center">
                        <ShieldCheckIcon className="h-4 w-4 mr-1" />
                        Administrator
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {!user.isVerified && (
                <div className="mt-6">
                  <button
                    onClick={() => navigate('/admin/verify-email')}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium shadow transition"
                  >
                    Verify Email
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminProfilePage;
