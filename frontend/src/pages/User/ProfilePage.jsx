import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  updateProfile,
  loadUser,
} from '../../redux/slices/authSlice';
import {
  UserCircleIcon,
  PencilIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  CalendarIcon,
  UserIcon,
  XMarkIcon,
  CheckIcon,
  PhotoIcon,
} from '@heroicons/react/24/solid';
import LoadingSpinner from '../../components/LoadingSpinner';

const ProfilePage = () => {
  const { user, loading } = useSelector((state) => state.auth);
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
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    if (avatarFile) formDataToSend.append('avatar', avatarFile);

    try {
      const result = await dispatch(updateProfile(formDataToSend));
      if (updateProfile.fulfilled.match(result)) {
        setIsEditing(false);
        dispatch(loadUser());
      } else {
        console.error('Update failed:', result.payload);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  if (!user) return <LoadingSpinner size="lg" />;

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white">
            <div className="flex items-center">
              <div className="flex-shrink-0 relative">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="User Avatar"
                    className="h-20 w-20 rounded-full object-cover border-4 border-white"
                  />
                ) : (
                  <UserCircleIcon className="h-20 w-20 text-white" />
                )}
                {isEditing && (
                  <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow">
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                      <PhotoIcon className="h-5 w-5 text-green-600" />
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>
                )}
              </div>
              <div className="ml-6">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="text-2xl font-bold bg-transparent border-b border-white focus:outline-none"
                  />
                ) : (
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                )}
                <p className="text-white text-opacity-90">{user.email}</p>
                <div className="mt-2 flex items-center">
                  <ShieldCheckIcon className="h-5 w-5 mr-1" />
                  <span className="text-sm">Registered User</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-bold text-gray-800">Profile Information</h1>
              {isEditing ? (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    <XMarkIcon className="h-4 w-4 mr-1" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? (
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
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <PencilIcon className="h-4 w-4 mr-1" />
                  Edit Profile
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Info */}
              <div className="bg-gray-50 p-5 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2 text-green-600" />
                  Personal Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    ) : (
                      <p className="font-medium">{user.name}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
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

              {/* Account Info */}
              <div className="bg-gray-50 p-5 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <ShieldCheckIcon className="h-5 w-5 mr-2 text-green-600" />
                  Account Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : 'Not available'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Status</p>
                    <p className="font-medium flex items-center">
                      <EnvelopeIcon className="h-4 w-4 mr-1" />
                      {user.isVerified ? 'Verified' : 'Not Verified'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {!user.isVerified && (
              <div className="mt-6">
                <button
                  onClick={() => navigate('/verify-email')}
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
  );
};

export default ProfilePage;
