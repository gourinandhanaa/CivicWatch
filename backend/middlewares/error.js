const ErrorHandler = require("../utils/errorhandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  // Development environment
  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack,
      error: err
    });
  }

  // Production environment
  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(val => val.message).join(', ');
      error = new Error(message);
      err.statusCode = 400;
    }

    // Mongoose Bad ObjectId
    if (err.name === 'CastError') {
      const message = `Resource not found: ${err.path}`;
      error = new Error(message);
      err.statusCode = 400;
    }

     if(err.name == 'JSONWebTokenError'){
      let message = `JSON Web Token is invalid . Try Again`;
      error = new Error(message);
      err.statusCode = 400;
     }
    if(err.name == 'TokenExpiredError'){
      let message = `JSON Web Token is Expired`;
      error = new Error(message);
      err.statusCode=400;
     }


    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }

  // Fallback if NODE_ENV is not set
  res.status(err.statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};
