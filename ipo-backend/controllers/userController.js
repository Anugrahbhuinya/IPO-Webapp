
const User = require("../models/User");

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    // Fetch all users, excluding password field
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, error: `User not found with id of ${req.params.id}` });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// Add other user management functions (create, update, delete) if needed later

