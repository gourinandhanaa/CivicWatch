const issueData = require('../data/issues.json');
const Issue = require('../models/issueModel');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database');

dotenv.config({ path: 'backend/config/config.env' });
connectDatabase();

const seedIssues = async () => {
  try {
    await Issue.deleteMany();
    console.log("Issues Deleted");
    await Issue.insertMany(issueData);
    console.log("All issues added!");
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};

seedIssues();
