const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
  } 
  // Optional: Set token from cookie if you plan to use cookies
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({ success: false, error: "Not authorized to access this route (no token)" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to the request object
    req.user = await User.findById(decoded.id);

    if (!req.user) {
        // Handle case where user associated with token no longer exists
        return res.status(401).json({ success: false, error: "Not authorized to access this route (user not found)" });
    }

    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(401).json({ success: false, error: "Not authorized to access this route (token invalid)" });
  }
};

// Grant access to specific roles (Example)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: `User role '${req.user ? req.user.role : 'none'}' is not authorized to access this route` 
      });
    }
    next();
  };
};

