import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createNewReport } from '../../redux/slices/userSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  CloudArrowUpIcon,
  MapPinIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/solid';

const NewReport = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    pincode: '',
    category: 'Other',
    severity: 3,
    reporterName: user?.name || '',
    reporterMobile: user?.mobile || '',
    images: []
  });

  const [previewImages, setPreviewImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'severity' ? Number(value) : value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...previews]);

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('pincode', formData.pincode);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('severity', formData.severity);
    formDataToSend.append('reporterName', formData.reporterName);
    formDataToSend.append('reporterMobile', formData.reporterMobile);

    formData.images.forEach((image) => {
      formDataToSend.append('images', image);
    });

    dispatch(createNewReport(formDataToSend))
      .unwrap()
      .then(() => {
        toast.success('✅ Report submitted successfully!');
        navigate('/user/my-reports');
      })
      .catch((error) => {
        toast.error('❌ Failed to submit report. Please try again.');
        console.error('Error creating report:', error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Report a New Issue</h2>
          <p className="mt-2 text-sm text-gray-600">
            Help improve your community by reporting issues you encounter
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Title */}
              <div className="sm:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Issue Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                />
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <div className="mt-1 relative">
                  <MapPinIcon className="absolute h-5 w-5 left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    id="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="pl-10 block w-full border border-gray-300 rounded-md py-2 px-3"
                  />
                </div>
              </div>

              {/* Pincode */}
              <div>
                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  id="pincode"
                  required
                  value={formData.pincode}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md py-2 px-3"
                >
                  <option value="Road">Road</option>
                  <option value="Sanitation">Sanitation</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Water">Water</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Severity */}
              <div>
                <label htmlFor="severity" className="block text-sm font-medium text-gray-700">
                  Severity (1-5)
                </label>
                <input
                  type="range"
                  name="severity"
                  id="severity"
                  min="1"
                  max="5"
                  value={formData.severity}
                  onChange={handleChange}
                  className="mt-2 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 (Low)</span>
                  <span>2</span>
                  <span>3 (Medium)</span>
                  <span>4</span>
                  <span>5 (High)</span>
                </div>
              </div>

              {/* Reporter Info */}
              <div>
                <label htmlFor="reporterName" className="block text-sm font-medium text-gray-700">
                  Your Name
                </label>
                <input
                  type="text"
                  name="reporterName"
                  id="reporterName"
                  required
                  value={formData.reporterName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                />
              </div>

              <div>
                <label htmlFor="reporterMobile" className="block text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="reporterMobile"
                  id="reporterMobile"
                  required
                  value={formData.reporterMobile}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                />
              </div>

              {/* Image Upload */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Upload Images</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md">
                  <div className="space-y-1 text-center">
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer text-indigo-600 hover:text-indigo-500"
                      >
                        <span>Upload files</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          multiple
                          onChange={handleImageChange}
                          accept="image/*"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>

              {/* Image Previews */}
              {previewImages.length > 0 && (
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Image Previews</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {previewImages.map((preview, index) => (
                      <img
                        key={index}
                        src={preview}
                        alt={`Preview ${index}`}
                        className="h-24 w-24 object-cover rounded-md"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/user/my-reports')}
                className="py-2 px-4 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewReport;
