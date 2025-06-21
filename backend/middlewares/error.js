// backend/middlewares/error.js

const ErrorHandler = require("../utils/errorhandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  console.error('🔥 Error:', err); // ✅ Log everything in all environments

  // Dev environment: detailed output
  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      success: false,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }

  // Prod environment: clean but informative
  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    // Handle specific errors
    if (err.name === 'ValidationError') {
      error.message = Object.values(err.errors).map(val => val.message).join(', ');
      error.statusCode = 400;
    }

    if (err.name === 'CastError') {
      error.message = `Resource not found. Invalid: ${err.path}`;
      error.statusCode = 400;
    }

    if (err.name === 'JsonWebTokenError') {
      error.message = 'JSON Web Token is invalid. Try again.';
      error.statusCode = 400;
    }

    if (err.name === 'TokenExpiredError') {
      error.message = 'JSON Web Token has expired. Please login again.';
      error.statusCode = 400;
    }

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }

  // If NODE_ENV is not set
  return res.status(err.statusCode).json({
    success: false,
    message: err.message
  });
};
