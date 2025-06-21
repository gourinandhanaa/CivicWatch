const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });

const app = require('./app');
const connectDatabase = require('./config/database');

// Connect to MongoDB
connectDatabase();

// Handle uncaught exceptions (e.g., undefined variable)
process.on('uncaughtException', (err) => {
  process.exit(1);
});

// Start the server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} [${process.env.NODE_ENV}]`);
});

// Handle unhandled promise rejections (e.g., DB fail)
process.on('unhandledRejection', (err) => {
  console.error(' Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});