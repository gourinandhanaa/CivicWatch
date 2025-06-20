const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter issue title"],
    trim: true,
    maxlength: [100, "Title can't exceed 100 characters"]
  },
  description: {
    type: String,
    required: [true, "Please enter issue description"],
    maxlength: [1000, "Description can't exceed 1000 characters"]
  },
  category: {
    type: String,
    enum: ["Road", "Sanitation", "Electricity", "Water", "Other"],
    default: "Other"
  },
  location: {
    type: String,
    required: [true, "Please provide issue location"]
  },
  pincode: {
    type: String,
    required: [true, "Please provide a pincode"]
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Resolved"],
    default: "Pending"
  },
  severity: {
    type: Number,
    required: [true, "Please provide issue severity (1-5)"],
    min: [1, "Severity must be at least 1"],
    max: [5, "Severity cannot exceed 5"]
  },
  images: [
    {
      image: {
        type: String,
        required: true
      }
    }
  ],
  reporters: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      reporterName: {
        type: String,
        required: true
      },
      reporterMobile: {
        type: String,
        required: true
      }
    }
  ],
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 🔍 Add compound text index to support full search
issueSchema.index({
  title: 'text',
  description: 'text',
  location: 'text',
  pincode: 'text'
});

module.exports = mongoose.model("Issue", issueSchema);
