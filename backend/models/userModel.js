const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name.']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email.'],
    unique: [true, 'This email is already registered.'],
    validate: [validator.isEmail, 'Please enter a valid email address.']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: [true, 'Please enter password'],
    minlength: [6, 'Password must be at least 6 characters.'],
    select: false
  },
  avatar: {
    type: String,
    default: 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v123456/default_avatar.png'
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  resetPasswordToken: String,
  resetPasswordTokenExpire: Date,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 🔒 Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔐 Generate JWT
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
};

// 🔍 Validate password
userSchema.methods.isValidPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🔁 Get Reset Password Token
userSchema.methods.getResetToken = function () {
  const token = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000;
  return token;
};

// 📩 Get Email Verification Token — fixed to 32 bytes
userSchema.methods.getVerificationToken = function () {
  const token = crypto.randomBytes(32).toString('hex'); // ✅ 32 bytes = 64 chars
  this.verificationToken = crypto.createHash('sha256').update(token).digest('hex');
  this.verificationTokenExpire = Date.now() + 15 * 60 * 1000; // 15 mins
  return token;
};

module.exports = mongoose.model("User", userSchema);
