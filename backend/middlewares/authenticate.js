const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require('jsonwebtoken');
const User = require("../models/userModel");

// ✅ Auth middleware: supports both cookies and Authorization headers
exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  let token;

  // 🔍 Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // 🔍 Or in cookies
  else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  // ❌ No token found
  if (!token) {
    return next(new ErrorHandler('Authentication required', 401));
  }

  // ✅ Decode and attach user to request
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);

  if (!req.user) {
    return next(new ErrorHandler('User not found', 404));
  }

  next();
});

// ✅ Role-based access
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role ${req.user.role} is not authorized to access this resource`,
          403
        )
      );
    }
    next();
  };
};

// ✅ Email verification check
exports.isVerifiedUser = (req, res, next) => {
  if (!req.user.isVerified) {
    return next(new ErrorHandler('Please verify your email to access this resource', 403));
  }
  next();
};
