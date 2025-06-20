const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  promoteUserToAdmin
} = require('../controllers/authController'); // Admin-related functions are in authController

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');
const { getAdminStats } = require('../controllers/adminController');

// ✅ Admin stats
router.get('/stats', isAuthenticatedUser, authorizeRoles('admin'), getAdminStats);

// ✅ Manage Users
router.get('/users', isAuthenticatedUser, authorizeRoles('admin'), getAllUsers);
router.get('/users/:id', isAuthenticatedUser, authorizeRoles('admin'), getUser);
router.put('/users/:id', isAuthenticatedUser, authorizeRoles('admin'), updateUser);
router.delete('/users/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteUser);
router.put('/users/:id/promote', isAuthenticatedUser, authorizeRoles('admin'), promoteUserToAdmin); // You should define this if not already

module.exports = router;
