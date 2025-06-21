const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/userModel');
const Verification = require('../models/verificationModel');
const catchAsyncError = require('../middlewares/catchAsyncError');
const sendEmail = require('../utils/email');
const ErrorHandler = require('../utils/errorhandler');
const { sendToken } = require('../utils/jwt');

// REGISTER USER (With email verification)
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password, avatar } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser && existingUser.isVerified) {
    return next(new ErrorHandler('Email already exists', 400));
  }

  await Verification.deleteMany({ email });

  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  await Verification.create({
    name,
    email,
    password,
    avatar,
    tokenHash,
    tokenExpire: Date.now() + 24 * 60 * 60 * 1000
  });

  const verifyURL = `${process.env.FRONTEND_URL}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;
  const message = `Welcome to CivicWatch! Please verify your email:\n\n${verifyURL}`;

  try {
    await sendEmail({
      email,
      subject: 'CivicWatch Email Verification',
      message,
      html: `<p>Welcome to CivicWatch!</p><p><a href="${verifyURL}">Click here to verify your email</a></p>`
    });

    res.status(200).json({
      success: true,
      message: `Verification link sent to ${email}`
    });
  } catch (err) {
    await Verification.deleteOne({ email });
    return next(new ErrorHandler('Failed to send verification email', 500));
  }
});

// VERIFY EMAIL
exports.verifyEmail = catchAsyncError(async (req, res, next) => {
  const { token, email } = req.query;

  if (!token || !email) return next(new ErrorHandler('Token and email are required', 400));

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const verificationData = await Verification.findOne({
    tokenHash,
    email,
    tokenExpire: { $gt: Date.now() }
  });

  if (!verificationData) {
    const existingUser = await User.findOne({ email });
    if (existingUser?.isVerified) {
      return res.status(200).json({ success: true, message: 'Email already verified. You can log in.' });
    }
    return next(new ErrorHandler('Invalid or expired token', 400));
  }

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name: verificationData.name,
      email: verificationData.email,
      password: verificationData.password,
      avatar: verificationData.avatar,
      isVerified: true
    });
  } else {
    user.isVerified = true;
    await user.save();
  }

  await Verification.deleteOne({ _id: verificationData._id });

  const authToken = user.getJwtToken();

  res.status(200).json({
    success: true,
    message: 'Email verified successfully',
    token: authToken,
    user
  });
});

// LOGIN (with debug logs)
exports.loginUser = catchAsyncError(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("❌ Missing email or password");
      return next(new ErrorHandler('Please provide email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log("❌ User not found:", email);
      return next(new ErrorHandler('Invalid email or password', 401));
    }

    if (!user.isVerified) {
      console.log("❌ User not verified:", email);
      return next(new ErrorHandler('Please verify your email first', 403));
    }

    if (!user.password) {
      console.log("❌ No password found in DB for:", email);
      return next(new ErrorHandler('Password not set for this user', 500));
    }

    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
      console.log("❌ Password mismatch for:", email);
      return next(new ErrorHandler('Invalid email or password', 401));
    }

    console.log("✅ Login successful for:", email);
    sendToken(user, 200, res);

  } catch (err) {
    console.error("🔥 Login crash:", err);
    return next(new ErrorHandler('Internal server error during login', 500));
  }
});

// LOAD USER
exports.getUserProfile = catchAsyncError(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, user });
});

// LOGOUT
exports.logoutUser = (req, res) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  }).status(200).json({ success: true, message: 'Logged out successfully' });
};

// FORGOT PASSWORD
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new ErrorHandler('No user with this email', 404));

  const resetToken = user.getResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  const message = `Reset your password here:\n\n${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset',
      message,
    });

    res.status(200).json({
      success: true,
      message: `Reset email sent to ${user.email}`
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler('Failed to send reset email', 500));
  }
});

// RESET PASSWORD
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const resetToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: resetToken,
    resetPasswordTokenExpire: { $gt: Date.now() }
  });

  if (!user) return next(new ErrorHandler('Invalid or expired token', 400));
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler('Passwords do not match', 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpire = undefined;
  await user.save();

  sendToken(user, 200, res);
});

// CHANGE PASSWORD
exports.changePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  const isMatch = await user.isValidPassword(req.body.oldPassword);
  if (!isMatch) return next(new ErrorHandler('Old password incorrect', 401));

  user.password = req.body.newPassword;
  await user.save();

  res.status(200).json({ success: true, message: 'Password updated successfully' });
});

// UPDATE PROFILE
exports.updateProfile = catchAsyncError(async (req, res) => {
  const updates = {
    name: req.body.name,
    email: req.body.email
  };

  if (req.file) {
    updates.avatar = req.file.path;
  }

  const user = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    user
  });
});

// 🔐 ADMIN: GET ALL USERS
exports.getAllUsers = catchAsyncError(async (req, res) => {
  const users = await User.find();
  res.status(200).json({ success: true, users });
});

// 🔐 ADMIN: GET ONE USER
exports.getUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorHandler('User not found', 404));
  res.status(200).json({ success: true, user });
});

// 🔐 ADMIN: UPDATE USER
exports.updateUser = catchAsyncError(async (req, res) => {
  const updates = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  };
  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true
  });
  res.status(200).json({ success: true, user });
});

// 🔐 ADMIN: DELETE USER
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorHandler('User not found', 404));

  await user.deleteOne();
  res.status(200).json({ success: true, message: 'User deleted successfully' });
});

// 🔐 ADMIN: PROMOTE USER TO ADMIN
exports.promoteUserToAdmin = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorHandler('User not found', 404));

  if (user.role === 'admin') {
    return next(new ErrorHandler('User is already an admin', 400));
  }

  user.role = 'admin';
  await user.save();

  res.status(200).json({
    success: true,
    message: 'User promoted to admin successfully',
    user
  });
});
