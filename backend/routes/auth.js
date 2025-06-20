const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  changePassword,
  updateProfile,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  verifyEmail
} = require('../controllers/authController');

const {
  isAuthenticatedUser,
  authorizeRoles,
  isVerifiedUser
} = require('../middlewares/authenticate');

const upload = require('../middlewares/upload'); // for avatar uploads

// =========================
// 🔐 AUTH ROUTES
// =========================
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);

router.post('/password/forgot', forgotPassword);
router.post('/password/reset/:token', resetPassword);

// Email verification (no change)
router.get('/verify-email', verifyEmail);

// =========================
// 👤 USER ROUTES
// Requires login and email verification
// =========================
router.get('/myprofile', isAuthenticatedUser, isVerifiedUser, getUserProfile);
router.put('/password/change', isAuthenticatedUser, isVerifiedUser, changePassword);

// Update profile (with optional avatar upload)
router.put(
  '/update-profile',
  isAuthenticatedUser,
  isVerifiedUser,
  upload.single('avatar'),
  updateProfile
);

// =========================
// 🛠️ ADMIN ROUTES
// =========================
router.get(
  '/admin/users',
  isAuthenticatedUser,
  authorizeRoles('admin'),
  getAllUsers
);

router
  .route('/admin/user/:id')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getUser)
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateUser)
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser);

module.exports = router;
