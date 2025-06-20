import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyReports, deleteReport } from '../../redux/slices/userSlice';
import LoadingSpinner from '../../components/LoadingSpinner';
import { CalendarDaysIcon, MapPinIcon, ExclamationTriangleIcon, TrashIcon } from '@heroicons/react/24/solid';
import AddReportButton from '../../components/AddReportButton';
import { toast } from 'react-toastify';

const MyReports = () => {
  const dispatch = useDispatch();
  const { myReports, loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchMyReports());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      dispatch(deleteReport(id))
        .unwrap()
        .then(() => {
          toast.success('✅ Report deleted successfully');
          dispatch(fetchMyReports());
        })
        .catch((err) => {
          toast.error('❌ Failed to delete report');
          console.error(err);
        });
    }
  };

  return (
    <div className="p-6 relative min-h-screen bg-gray-50">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">📋 My Reports</h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : myReports.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <ExclamationTriangleIcon className="h-12 w-12 mx-auto text-yellow-400 mb-4" />
          <p>You haven't submitted any reports yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myReports.map((report) => (
            <div
              key={report._id}
              className="bg-white p-5 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-bold text-indigo-700 mb-2">{report.title}</h3>
              <p className="text-gray-600 mb-3 line-clamp-3">{report.description}</p>

              <div className="flex items-center text-sm text-gray-500 mb-1">
                <MapPinIcon className="h-4 w-4 mr-1 text-rose-500" />
                {report.location}
              </div>

              <div className="flex items-center text-sm text-gray-500 mb-1">
                <CalendarDaysIcon className="h-4 w-4 mr-1 text-blue-500" />
                {new Date(report.createdAt).toLocaleDateString()}
              </div>

              <div className="flex items-center justify-between mt-3">
                <span
                  className={`inline-block px-2 py-1 rounded-full font-medium text-white text-xs ${
                    report.status === 'Resolved' ? 'bg-emerald-500' : 'bg-yellow-500'
                  }`}
                >
                  {report.status}
                </span>

                <button
                  onClick={() => handleDelete(report._id)}
                  className="flex items-center text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  <TrashIcon className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddReportButton />
    </div>
  );
};

export default MyReports;
