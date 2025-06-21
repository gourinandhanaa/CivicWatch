const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

// ✅ Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL, // Use frontend URL from env for CORS
  credentials: true                 // Allow cookies (if used)
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'CivicWatch backend is operational' });
});

// ✅ Routes
const adminRouter = require('./routes/admin');
const authRouter = require('./routes/auth');
const issueRouter = require('./routes/issue');

app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/issue', issueRouter);

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ❌ Frontend serving logic removed for separate deployment setup

module.exports = app;
