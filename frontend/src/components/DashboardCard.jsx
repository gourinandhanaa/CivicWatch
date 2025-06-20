import React from 'react';
import PropTypes from 'prop-types';

const DashboardCard = ({ title, value, icon, color, trend, trendLabel, description }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-700',
    indigo: 'bg-indigo-100 text-indigo-700',
    amber: 'bg-amber-100 text-amber-700',
    emerald: 'bg-emerald-100 text-emerald-700',
  };

  const trendColor = trend >= 0 ? 'text-emerald-500' : 'text-red-500';
  const trendIcon = trend >= 0 ? (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  );

  return (
    <div className="bg-white rounded-xl shadow p-6 transition hover:shadow-md">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colorClasses[color] || 'bg-gray-100 text-gray-700'}`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
      {description && (
        <p className="mt-2 text-sm text-gray-400">{description}</p>
      )}
      {trend !== undefined && (
        <div className="mt-3 flex items-center">
          <span className={`inline-flex items-center ${trendColor}`}>
            {trendIcon}
            <span className="ml-1 text-xs font-medium">
              {Math.abs(trend)}{trendLabel ? ` ${trendLabel}` : ''}
            </span>
          </span>
        </div>
      )}
    </div>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node,
  color: PropTypes.oneOf(['blue', 'indigo', 'amber', 'emerald']),
  trend: PropTypes.number,
  trendLabel: PropTypes.string,
  description: PropTypes.string,
};

export default DashboardCard;
