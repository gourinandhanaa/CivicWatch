const dotenv = require('dotenv');
const path = require('path');
const express = require('express');
const app = require('./app');
const connectDatabase = require('./config/database');

// Load environment variables from config.env
dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });

// Connect to MongoDB
connectDatabase();

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  process.exit(1);
});

// Serve frontend build in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/build');
  app.use(express.static(frontendPath));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(frontendPath, 'index.html'));
  });
}

// Start the server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} [${process.env.NODE_ENV}]`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});
