exports.sendToken = (user, statusCode, res) => {
  // 🚫 Prevent sending token if user is not verified
  if (!user.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Please verify your email before logging in'
    });
  }

  // ✅ Create JWT token
  const token = user.getJwtToken();
  user.password = undefined;

  const cookieExpireDays = Number(process.env.COOKIE_EXPIRES_TIME) || 7;

  const options = {
    expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
    httpOnly: true
  };

  res.status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user
    });
};
