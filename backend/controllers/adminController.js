const User = require('../models/userModel');
const Issue = require('../models/issueModel');
const catchAsyncError = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/errorhandler');

const getAdminStats = async (req, res, next) => {
  try {
    // Count stats
    const [users, reports, pendingReports, resolvedReports] = await Promise.all([
      User.countDocuments(),
      Issue.countDocuments(),
      Issue.countDocuments({ status: 'Pending' }),
      Issue.countDocuments({ status: 'Resolved' })
    ]);

    // Resolution rate calculation
    const resolutionRate = reports > 0
      ? Math.floor((resolvedReports / reports) * 100)
      : 0;

    // Recent activity (latest 5 users & reports)
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name createdAt');

    const recentReports = await Issue.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title createdAt');

    res.status(200).json({
      success: true,
      admin: {
        name: req.user.name || 'Admin',
        email: req.user.email
      },
      stats: {
        users,
        reports,
        pendingReports,
        resolvedReports,
        resolutionRate,
        recentUsers,
        recentReports
      },
      lastUpdated: new Date()
    });
  } catch (err) {
    next(new ErrorHandler('Failed to load dashboard data', 500));
  }
};

module.exports = {
  getAdminStats: catchAsyncError(getAdminStats)
};
