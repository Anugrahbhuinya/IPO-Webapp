const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d", // Default to 30 days
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  try {
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role, // Optional, defaults to 'user' in schema
    });

    // Create token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    // Handle potential errors like duplicate email
    res.status(400).json({ success: false, error: error.message });
    // Consider more specific error handling/logging
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password were entered
  if (!email || !password) {
    return res.status(400).json({ success: false, error: "Please provide an email and password" });
  }

  try {
    // Check for user
    const user = await User.findOne({ email }).select("+password"); // Explicitly select password

    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    // Create token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private (requires token)
// Note: This requires authentication middleware which will be added later
exports.getMe = async (req, res, next) => {
  // req.user will be set by the auth middleware
  if (!req.user) {
      return res.status(401).json({ success: false, error: "Not authorized" });
  }
  // We might fetch fresh user data here if needed, or just return req.user
  const user = await User.findById(req.user.id);

  if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
  }

  res.status(200).json({
    success: true,
    data: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

