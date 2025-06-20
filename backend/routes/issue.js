const express = require('express');
const {
  getIssue,
  newIssue,
  getSingleIssue,
  updateIssue,
  deleteIssue,
  getMyReports,
  getUserStats
} = require('../controllers/issueController');

const upload = require('../middlewares/upload');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');

const router = express.Router();

/* 
  📦 USER ROUTES 
*/

// Create a new issue with optional image uploads
router.post('/new', isAuthenticatedUser, upload.array('images', 5), newIssue);
router.get('/my-reports', isAuthenticatedUser, getMyReports);
// Get all issues (user-level)
router.get('/', isAuthenticatedUser, getIssue);
router.get('/user/stats', isAuthenticatedUser, getUserStats);
// Delete an issue (only if user is authorized and is a reporter)
router.delete('/:id', isAuthenticatedUser, deleteIssue);


/* 
  🛠️ ADMIN ROUTES 
*/

// Admin: Get all issues
router.get('/admin', isAuthenticatedUser, authorizeRoles('admin'), getIssue);

// Admin: Get single issue / update issue
router.route('/admin/:id')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getSingleIssue)
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateIssue);

module.exports = router;
