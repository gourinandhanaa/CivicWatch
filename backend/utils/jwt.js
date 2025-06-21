// utils/jwt.js

exports.sendToken = (user, statusCode, res) => {
  try {
    if (!user || !user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in'
      });
    }

    // Check if JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing from environment variables.");
      return res.status(500).json({
        success: false,
        message: 'Server configuration error. Please contact admin.'
      });
    }

    const token = user.getJwtToken();

    // Sanitize sensitive info
    user.password = undefined;

    const cookieExpireDays = Number(process.env.COOKIE_EXPIRES_TIME) || 7;

    const options = {
      expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only send cookies over HTTPS in production
      sameSite: 'Lax'
    };

    res.status(statusCode)
      .cookie('token', token, options)
      .json({
        success: true,
        token,
        user
      });

  } catch (error) {
    console.error("Error in sendToken:", error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during token generation'
    });
  }
};
