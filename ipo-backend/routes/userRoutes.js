const express = require("express");
const {
  getUsers,
  getUser,
  // Add createUser, updateUser, deleteUser later if needed
} = require("../controllers/userController");

const router = express.Router();

// Import middleware
const { protect, authorize } = require("../middleware/authMiddleware");

// Apply protect and authorize middleware to all routes in this file
// Only admins should manage users
router.use(protect);
router.use(authorize("admin"));

router.route("/").get(getUsers);
router.route("/:id").get(getUser);

// Add routes for POST, PUT, DELETE later if needed

module.exports = router;

