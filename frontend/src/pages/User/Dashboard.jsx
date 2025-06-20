import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserStats, fetchMyReports } from '../../redux/slices/userSlice';
import DashboardCard from '../../components/DashboardCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import {
  DocumentDuplicateIcon,
  ClockIcon,
  CheckBadgeIcon,
  TrashIcon,
  PlusCircleIcon
} from '@heroicons/react/24/solid';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { stats, loading, myReports } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUserStats());
    dispatch(fetchMyReports());
  }, [dispatch]);

  // ✅ Sort recent activity by creation date descending
  const sortedReports = [...myReports].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Welcome Back, {user?.name?.split(' ')[0] || 'User'}! 👋
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardCard
                title="Reports Submitted"
                value={stats.reportsSubmitted}
                icon={<DocumentDuplicateIcon className="h-8 w-8 text-blue-500" />}
                color="blue"
                description="Total reports you've submitted"
              />
              <DashboardCard
                title="Pending Reports"
                value={stats.reportsPending}
                icon={<ClockIcon className="h-8 w-8 text-amber-500" />}
                color="amber"
                description="Reports awaiting resolution"
              />
              <DashboardCard
                title="Resolved Reports"
                value={stats.reportsResolved}
                icon={<CheckBadgeIcon className="h-8 w-8 text-emerald-500" />}
                color="emerald"
                description="Successfully resolved cases"
              />
            </div>

            {/* ✅ Real Recent Activity */}
            <div className="mt-12 bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {sortedReports.slice(0, 5).map((report) => (
                  <div
                    key={report._id}
                    className="flex items-start pb-4 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
                      <PlusCircleIcon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-800">
                        You submitted <strong>"{report.title}"</strong>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(report.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                {sortedReports.length === 0 && (
                  <div className="text-sm text-gray-500">No activity yet.</div>
                )}
              </div>
            </div>

            {/* Mobile-only CTA */}
            <div className="mt-8 md:hidden text-center">
              <button
                onClick={() => navigate('/user/my-reports')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow transition w-full"
              >
                📋 View My Reports
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default UserDashboard;
