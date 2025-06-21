const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

// Debugging middleware - logs all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Basic configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check route
app.get('/', (req, res) => {
  res.send('CivicWatch backend is operational');
});

// Route imports with error handling
try {
  const adminRouter = require('./routes/admin');
  app.use('/api/v1/admin', adminRouter);
  console.log('✅ Admin routes mounted successfully');
} catch (err) {
  console.error('❌ Failed to load admin routes:', err.message);
  process.exit(1);
}

try {
  const authRouter = require('./routes/auth');
  app.use('/api/v1/auth', authRouter);
  console.log('✅ Auth routes mounted successfully');
} catch (err) {
  console.error('❌ Failed to load auth routes:', err.message);
}

try {
  const issueRouter = require('./routes/issue');
  app.use('/api/v1/issue', issueRouter);
  console.log('✅ Issue routes mounted successfully');
} catch (err) {
  console.error('❌ Failed to load issue routes:', err.message);
}

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ success: false, message: 'Internal server error' });
});

module.exports = app; 