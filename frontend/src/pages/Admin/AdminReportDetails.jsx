import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleIssue, updateIssue } from '../../redux/slices/adminSlice';
import LoadingSpinner from '../../components/LoadingSpinner';
import { CheckCircleIcon, ClockIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';

const AdminReportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { reports, loading, error } = useSelector((state) => state.admin);
  const report = reports.find(r => r._id === id);

  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    dispatch(getSingleIssue(id));
  }, [dispatch, id]);

  const handleStatusToggle = async () => {
    try {
      setStatusUpdating(true);
      const updatedStatus = report.status === 'Resolved' ? 'Pending' : 'Resolved';
      await dispatch(updateIssue({ id, status: updatedStatus }));
    } catch (err) {
      console.error('❌ Failed to update status:', err);
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  if (!report) {
    return <p className="text-center text-gray-600 mt-10">Report not found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-8">
        <button
          onClick={() => navigate(-1)}
          className="text-base text-indigo-600 mb-5 flex items-center hover:underline"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Reports
        </button>

        <h2 className="text-3xl font-bold text-gray-800 mb-3">{report.title}</h2>
        <p className="text-lg text-gray-700 mb-5">{report.description}</p>

        <div className="text-base text-gray-600 space-y-2 mb-6">
          <p>📍 <strong>Location:</strong> {report.location}</p>
          <p>📮 <strong>Pincode:</strong> {report.pincode}</p>
          <p>🔥 <strong>Severity:</strong> {report.severity}</p>
          <p>📌 <strong>Status:</strong> <span className="font-semibold">{report.status || 'Pending'}</span></p>
        </div>

        {/* Reporters */}
        <div className="mb-6">
          <h4 className="font-semibold text-lg text-gray-700 mb-3">Reporters:</h4>
          <ul className="text-base text-gray-600 space-y-1">
            {report.reporters.map((rep, idx) => (
              <li key={idx}>👤 {rep.reporterName} - 📞 {rep.reporterMobile}</li>
            ))}
          </ul>
        </div>

        {/* Images */}
        {report.images?.length > 0 && (
          <div className="mb-8">
            <h4 className="font-semibold text-lg text-gray-700 mb-3">Images:</h4>
            <div className="flex flex-wrap gap-5">
              {report.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.image}
                  alt={`issue-${idx}`}
                  className="h-40 w-40 object-cover rounded border"
                />
              ))}
            </div>
          </div>
        )}

        {/* Status Toggle */}
        <button
          onClick={handleStatusToggle}
          disabled={statusUpdating}
          className={`flex items-center gap-3 px-5 py-3 rounded text-white font-semibold text-base ${
            report.status === 'Resolved'
              ? 'bg-yellow-500 hover:bg-yellow-600'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {report.status === 'Resolved' ? (
            <>
              <ClockIcon className="h-5 w-5" />
              Mark as Pending
            </>
          ) : (
            <>
              <CheckCircleIcon className="h-5 w-5" />
              Mark as Resolved
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AdminReportDetails;
