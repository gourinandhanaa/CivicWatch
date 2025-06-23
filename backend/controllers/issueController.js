const Issue = require('../models/issueModel');
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncError = require('../middlewares/catchAsyncError');
const APIFeatures = require('../utils/apiFeatures');

// 📥 Get all issues  URI : /api/v1/issue
exports.getIssue = async (req, res, next) => {
  try {
    const resPerPage = 4;
    const apiFeatures = new APIFeatures(Issue.find(), req.query).search().filter();
    const queryForCount = apiFeatures.query;
    apiFeatures.paginate(resPerPage);
    const issues = await apiFeatures.query;
    const totalCount = await Issue.countDocuments(queryForCount.getQuery());
    res.status(200).json({
      success: true,
      reports: issues,
      count: totalCount
    });
  } catch (error) {
    console.error("❌ Error in getIssue:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};



// Create a new issue  URI : /api/v1/issue/new
exports.newIssue = catchAsyncError(async (req, res, next) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ success: false, message: "Unauthorized user" });
  }

  const {
    title,
    description,
    location,
    pincode,
    category,
    severity,
    reporterName,
    reporterMobile
  } = req.body;

  console.log("📨 Incoming new issue request:", req.body);
  console.log("🖼️ Uploaded files:", req.files);

  const uploadedImages = (req.files || []).map(file => ({
  image: file.path.replace(/\\/g, '/')
}));


  const reporterObj = {
    user: req.user._id,
    reporterName,
    reporterMobile
  };

  // 🔍 Check for duplicate issue
  let existingIssue = await Issue.findOne({
    title: title.trim(),
    location: location.trim(),
    description: description.trim()
  });

  if (existingIssue) {
    const alreadyReported = existingIssue.reporters.some(r =>
      r.user.toString() === req.user._id.toString()
    );

    if (alreadyReported) {
      return res.status(409).json({
        success: false,
        message: "You have already reported this issue"
      });
    }

    existingIssue.reporters.push(reporterObj);
    existingIssue.images.push(...uploadedImages);
    await existingIssue.save();

    return res.status(200).json({
      success: true,
      message: "Issue already exists, your report has been added",
      data: existingIssue
    });
  }

  // 🆕 Create a new issue (with primary reporter marked)
  const newIssue = await Issue.create({
    title,
    description,
    location,
    pincode,
    category,
    severity,
    images: uploadedImages,
    reporters: [reporterObj],
    reportedBy: req.user._id // ✅ KEY LINE: used for delete permissions
  });

  res.status(201).json({
    success: true,
    message: "New issue reported successfully",
    data: newIssue
  });
});

// ✏️ Update issue by ID  URI : /api/v1/issue/:id
exports.updateIssue = async (req, res, next) => {
  try {
    let issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found"
      });
    }

    issue = await Issue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: issue
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// 🗑️ Delete single issue by ID  URI : /api/v1/issue/:id
exports.deleteIssue = catchAsyncError(async (req, res, next) => {
  try {
    console.log("🔴 DELETE request received:", req.params.id);
    console.log("🧑 Logged-in user ID:", req.user?._id);

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      console.log("⚠️ Issue not found");
      return next(new ErrorHandler("Issue not found", 404));
    }

    console.log("📦 Found issue:", issue.title);
    console.log("👤 issue.reportedBy:", issue.reportedBy);
    console.log("🧾 typeof reportedBy:", typeof issue.reportedBy);

    if (!issue.reportedBy || issue.reportedBy.toString() !== req.user._id.toString()) {
      console.log("⛔ Unauthorized delete attempt");
      return next(new ErrorHandler("You are not authorized to delete this issue", 403));
    }

    await issue.deleteOne();

    console.log("✅ Issue deleted successfully");
    res.status(200).json({
      success: true,
      message: "Issue deleted!"
    });
  } catch (error) {
    console.error("🔥 Error deleting issue:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});


// Get issues reported by current user
exports.getMyReports = catchAsyncError(async (req, res, next) => {
  const issues = await Issue.find({ 'reporters.user': req.user._id });

  res.status(200).json({
    success: true,
    count: issues.length,
    data: issues
  });
});
// ✋ Get single issue by ID
exports.getSingleIssue = catchAsyncError(async (req, res, next) => {
  const issue = await Issue.findById(req.params.id);

  if (!issue) {
    return next(new ErrorHandler('Issue not found', 404));
  }

  res.status(200).json({
    success: true,
    data: issue
  });
});
// 📊 Get user report stats
exports.getUserStats = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;

  // Get all reports submitted by the user
  const allReports = await Issue.find({ 'reporters.user': userId });

  const reportsSubmitted = allReports.length;

  const reportsPending = allReports.filter(
    issue => issue.status?.toLowerCase() === 'pending'
  ).length;

  const reportsResolved = allReports.filter(
    issue => issue.status?.toLowerCase() === 'resolved'
  ).length;

  res.status(200).json({
    success: true,
    stats: {
      reportsSubmitted,
      reportsPending,
      reportsResolved,
    },
  });
});
